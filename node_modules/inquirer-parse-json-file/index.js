/**
 * `directory` type prompt
 */
var rx = require("rxjs");
var _ = require("lodash");
var util = require("util");
var fs = require("fs");
var chalk = require("chalk");
var figures = require("figures");
var cliCursor = require("cli-cursor");
var Base = require("inquirer/lib/prompts/base");
var observe = require("inquirer/lib/utils/events");
var Paginator = require("inquirer/lib/utils/paginator");
var Choices = require("inquirer/lib/objects/choices");
var Separator = require("inquirer/lib/objects/separator");
var { filter, map, mergeMap, scan, share, takeUntil, tap, merge } = require("rxjs/operators");

var path = require("path");

/**
 * Constants
 */
var BACK = "go back a directory";

/**
 * Constructor
 */

class Prompt extends Base {
  constructor(questions, rl, answers) {
    super(questions, rl, answers);

    if (!this.opt.basePath) {
      this.throwParamError("basePath");
    }

    this.basePath = path.isAbsolute(this.opt.basePath)
      ? path.resolve(this.opt.basePath)
      : path.resolve(process.cwd(), this.opt.basePath);
    this.currentPath = this.basePath;

    this.opt.fileExtensionFilter = ".json";
    this.opt.choices = new Choices(this.createChoices(this.basePath, 0), this.answers);
    this.selected = 0;

    this.firstRender = true;

    // Make sure no default is set (so it won't be printed)
    this.opt.default = null;

    this.searchTerm = "";

    this.paginator = new Paginator();
  }

  /**
   * Start the Inquiry session
   * @param  {Function} cb      Callback when prompt is done
   * @return {this}
   */

  _run(cb) {
    var self = this;
    self.searchMode = false;
    self.done = cb;
    var alphaNumericRegex = /\w|\.|\-/i;
    var events = observe(self.rl);

    var keyUps = events.keypress.pipe(
      filter(function(e) {
        return e.key.name === "up" || (!self.searchMode && e.key.name === "k");
      }),
      share()
    );

    var keyDowns = events.keypress.pipe(
      filter(function(e) {
        return e.key.name === "down" || (!self.searchMode && e.key.name === "j");
      }),
      share()
    );

    // var keySlash = events.keypress.pipe(
    //   filter(function(e) {
    //     return e.value === "/";
    //   }),
    //   share()
    // );

    var alphaNumeric = events.keypress.pipe(
      filter(function(e) {
        return e.key.name === "backspace" || alphaNumericRegex.test(e.value);
      }),
      share()
    );

    // var searchTerm = keySlash.pipe(
    //   mergeMap(function(md) {
    //     self.searchMode = true;
    //     self.searchTerm = "";
    //     self.render();
    //     var end$ = new rx.Subject();
    //     var done$ = merge(events.line, end$);

    //     return rx.of(
    //       alphaNumeric.pipe(
    //         map(function(e) {
    //           console.log("map");
    //           if (e.key.name === "backspace" && self.searchTerm.length) {
    //             self.searchTerm = self.searchTerm.slice(0, -1);
    //           } else if (e.value) {
    //             self.searchTerm += e.value;
    //           }
    //           if (self.searchTerm === "") {
    //             end$.onNext(true);
    //           }
    //           return self.searchTerm;
    //         }),
    //         takeUntil(done$),

    //         tap(null, null, function() {
    //           console.log("Complete!");
    //           self.searchMode = false;
    //           self.render();
    //           return false;
    //         })
    //       )
    //     );
    //   }),
    //   share()
    // );

    var outcome = this.handleSubmit(events.line);
    outcome.done.forEach(this.onSubmit.bind(this));
    outcome.traversal.forEach(this.handleTraversal.bind(this));
    keyUps.pipe(takeUntil(outcome.done)).forEach(this.onUpKey.bind(this));
    keyDowns.pipe(takeUntil(outcome.done)).forEach(this.onDownKey.bind(this));
    events.keypress.pipe(takeUntil(outcome.done)).forEach(this.hideKeyPress.bind(this));
    //searchTerm.pipe(takeUntil(outcome.done)).forEach(this.onKeyPress.bind(this));

    // Init the prompt
    cliCursor.hide();
    self.render();

    return this;
  }

  /**
   * Render the prompt to screen
   * @return {Prompt} self
   */

  render() {
    // Render question
    var message = this.getQuestion();

    if (this.firstRender) {
      message += chalk.dim("(Use arrow keys)");
    }

    // Render choices or answer depending on the state
    var relativePath = path.relative(this.opt.basePath, this.currentPath);
    if (this.status === "answered") {
      message += chalk.cyan(relativePath);
    } else {
      message += chalk.bold("\n Current directory: ") + this.opt.basePath + "/" + chalk.cyan(relativePath);
      var choicesStr = listRender(this.opt.choices, this.selected);
      message += "\n" + this.paginator.paginate(choicesStr, this.selected, this.opt.pageSize);

      // append search mode info
      // if (this.searchMode) {
      //   message += "\nSearch: " + this.searchTerm;
      // } else {
      //   message += '\n(Use "/" key to search this directory)';
      // }
    }

    this.firstRender = false;

    this.screen.render(message);
  }

  /**
   * When user press `enter` key
   */
  handleSubmit(e) {
    var self = this;
    var obx = e.pipe(
      map(function() {
        return self.opt.choices.getChoice(self.selected).value;
      }),
      scan(function(stack, curr) {
        var isBack = curr === BACK;
        var depth = stack.length;

        if (isBack && depth > 0) {
          stack.pop();
        } else if (isBack && depth === 0) {
          stack = [];
        } else {
          stack.push(curr);
        }

        return stack;
      }, []),
      share()
    );

    var done = obx.pipe(
      filter(function(stack) {
        return isFile(getAbsolutePath(self.basePath, stack));
      })
    );

    var traversal = obx.pipe(
      filter(function(stack) {
        return !isFile(getAbsolutePath(self.basePath, stack));
      }),
      takeUntil(done)
    );

    return {
      traversal: traversal,
      done: done
    };
  }

  /**
   *  when user selects to drill into a folder (by selecting folder name)
   */
  handleTraversal(value) {
    this.currentPath = getAbsolutePath(this.basePath, value);
    this.opt.choices = new Choices(this.createChoices(this.currentPath, value.length), this.answers);
    this.selected = 0;
    this.render();
  }

  /**
   * when user selects a file
   */
  onSubmit(value) {
    this.currentPath = getAbsolutePath(this.basePath, value);
    this.status = "answered";

    // Rerender prompt
    this.render();
    this.screen.done();
    cliCursor.show();

    const file = fs.readFileSync(this.currentPath, "utf8");
    let object = JSON.parse(file);
    if (_.isFunction(this.opt.filter)) {
      object = this.opt.filter(object);
    }

    this.done(object);
  }

  /**
   * When user press a key
   */
  hideKeyPress() {
    if (!this.searchMode) {
      this.render();
    }
  }

  onUpKey() {
    var len = this.opt.choices.realLength;
    this.selected = this.selected > 0 ? this.selected - 1 : len - 1;
    this.render();
  }

  onDownKey() {
    var len = this.opt.choices.realLength;
    this.selected = this.selected < len - 1 ? this.selected + 1 : 0;
    this.render();
  }

  onSlashKey(e) {
    this.render();
  }

  onKeyPress(e) {
    var index = this.findIndex.call(this, this.searchTerm);
    if (index >= 0) {
      this.selected = index;
    }
    this.render();
  }

  findIndex(term) {
    var item;
    for (var i = 0; i < this.opt.choices.realLength; i++) {
      item = this.opt.choices.realChoices[i].name.toLowerCase();
      if (item.indexOf(term) === 0) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Helper to create new choices based on previous selection.
   */
  createChoices(basePath, depth) {
    var choices = this.getOptions(basePath);
    if (choices.length > 0) {
      choices.push(new Separator());
    }
    if (depth > 0) {
      choices.push(new Separator());
      choices.push(BACK);
      choices.push(new Separator());
    }

    return choices;
  }
  /**
   * Function for getting list of folders and files in directory
   * @param  {String} basePath the path the folder to get a list of containing folders and files
   * @return {Array}           array of folder names inside of basePath
   */
  getOptions(basePath) {
    return fs
      .readdirSync(basePath)
      .filter(file => {
        var stats = fs.lstatSync(path.join(basePath, file));

        if (stats.isFile() && !file.toLowerCase().endsWith(this.opt.fileExtensionFilter)) {
          return false;
        }

        if (stats.isSymbolicLink()) {
          return false;
        }
        var isNotDotFile = path.basename(file).indexOf(".") !== 0;
        return isNotDotFile;
      })
      .sort();
  }
}
/**
 * Module exports
 */

module.exports = Prompt;

/**
 * Function for rendering list choices
 * @param  {Number} pointer Position of the pointer
 * @return {String}         Rendered content
 */
function listRender(choices, pointer) {
  var output = "";
  var separatorOffset = 0;

  choices.forEach(function(choice, i) {
    if (choice.type === "separator") {
      separatorOffset++;
      output += "  " + choice + "\n";
      return;
    }

    var isSelected = i - separatorOffset === pointer;
    var line = (isSelected ? figures.pointer + " " : "  ") + choice.name;
    if (isSelected) {
      line = chalk.cyan(line);
    }
    output += line + " \n";
  });

  return output.replace(/\n$/, "");
}

/**
 * Helper function to get the absolute path for a choice
 * @param  {String} basePath the containing path of the choice
 * @param {String} choices An array of choices that the user has made
 * @returns {String} the absolute path of the choice
 */
function getAbsolutePath(basePath, choices) {
  var paths = [basePath].concat(choices);
  return path.join.apply(null, paths);
}

function getRelativePath(basePathOption, baseAbsolutePath, choices) {
  return path.relative(basePathOption, getAbsolutePath(baseAbsolutePath, choices));
}

function isFile(filePath) {
  var stats;
  try {
    stats = fs.lstatSync(filePath);
  } catch (e) {
    return false;
  }
  return stats.isFile();
}
