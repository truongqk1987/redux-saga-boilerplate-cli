var expect = require("chai").expect;
var sinon = require("sinon");
var inquirer = require("inquirer");
var mock = require("mock-fs");
var ReadlineStub = require("../helpers/readline");
var Prompt = require("../../index");

describe("inquirer-directory", function() {
  var prompt;
  var rl;

  before(function() {
    mock({
      ".git": {},
      ".gitignore": "gitignore content",
      folder1: {
        "folder1-1": {},
        "test2.json": '{"test2": "string"}'
      },
      zfolder2: {
        "zfolder2-1": {}
      },
      "index.js": "some js here",
      "test.json": '{"test": "string"}',
      "a-symlink": mock.symlink({
        path: "folder1"
      })
    });
  });

  after(mock.restore);

  beforeEach(function() {
    rl = new ReadlineStub();
    prompt = new Prompt(
      {
        message: "test",
        name: "name",
        basePath: "./"
      },
      rl
    );
  });

  it("requires a basePath", function() {
    expect(function() {
      new Prompt({
        message: "foo",
        name: "name"
      });
    }).to.throw(/basePath/);
  });

  it("should list folders and files", function() {
    prompt.run();
    expect(rl.output.__raw__).to.contain("folder1");
    expect(rl.output.__raw__).to.contain("zfolder2");
    expect(rl.output.__raw__).to.contain("test.json");
  });

  it('should not contain folders starting with "." (private folders)', function() {
    prompt.run();
    expect(rl.output.__raw__).to.not.contain(".git");
    expect(rl.output.__raw__).to.not.contain(".gitignore");
  });

  it("should not contain non json files ", function() {
    prompt.run();
    expect(rl.output.__raw__).to.not.contain("index.js");
  });

  it("should allow users to drill into folder", function() {
    prompt.run();
    enter();
    expect(rl.output.__raw__).to.contain("folder1-1");
    expect(rl.output.__raw__).to.contain("test.js");
  });

  it("should allow users to go back after drilling", function() {
    prompt.run();
    enter();
    expect(rl.output.__raw__).to.contain("go back");
    moveDown();
    moveDown();
    moveDown();
    enter();
    expect(rl.output.__raw__).to.contain("zfolder2");
  });

  // it("should allow the user to search", function() {
  //   prompt.run();
  //   keypress("/");
  //   keypress("z");
  //   enter();
  //   expect(rl.output.__raw__).to.contain("zfolder2-1");
  // });

  it("should not allow users to go back past basePath", function() {
    prompt.run();
    expect(rl.output.__raw__).to.contain("go back");
  });

  it("should allow users to select a file", function(done) {
    prompt
      .run()
      .then(function(answer) {
        expect(answer.test2).to.equal("string");
        done();
      })
      .catch(console.error);
    enter();
    moveDown();
    enter();
  });

  function keypress(word) {
    word.split("").forEach(function(char) {
      rl.line = rl.line + char;
      rl.input.emit("keypress", char);
    });
  }

  function moveDown() {
    rl.input.emit("keypress", "", {
      name: "down"
    });
  }

  function moveUp() {
    rl.input.emit("keypress", "", {
      name: "up"
    });
  }

  function enter() {
    rl.emit("line");
  }
});
