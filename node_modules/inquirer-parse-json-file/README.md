# inquirer-parse-json-file

Json File prompt for [inquirer](https://github.com/SBoudrias/Inquirer.js)

Parses the JSON file and returns the object as it's answer.

## Installation

```
npm install --save inquirer-parse-json-file
```

## Features

- Support for symlinked files
- Vim style navigation

### Key Maps

- Use either `up`/`down` arrow keys or `k`/`j` to navigate
- Use `enter` to select option

## Usage

This prompt is anonymous, meaning you can register this prompt with the type name you please:

```javascript
inquirer.registerPrompt('jsonFile', require('inquirer-parse-json-file'));
inquirer.prompt({
  type: 'jsonFile',
  ...
})
```

Change `jsonFile` to whatever you might prefer.

### Options

Takes `type`, `name`, `message`, `filter`, `basePath` properties.

See [inquirer](https://github.com/SBoudrias/Inquirer.js) readme for meaning of all except **basePath**.

**basePath** is the relative path from your current working directory

#### Example

```javascript
inquirer.registerPrompt("jsonFile", require("inquirer-parse-json-file"));
inquirer
  .prompt([
    {
      type: "jsonFile",
      name: "json",
      message: "Select a json file?",
      basePath: "./src"
    }
  ])
  .then(function(answers) {
    // (answers.from is the path chosen)
  });
```

See also [example.js](https://github.com/archicroc/inquirer-parse-json-file-path/blob/master/example.js) for a working example

## Contributing

<a name="contributing"></a>

**Unit test**
Unit test are written in [Mocha](https://mochajs.org/). Please add a unit test for every new feature or bug fix. `npm test` to run the test suite.

**Documentation**
Add documentation for every API change. Feel free to send typo fixes and better docs!

## License

MIT

## Acknowledgements

Thanks to bmbarker90 and their inquirer-file-path repo that this is adapted from.

## Future features

- none. Have an Idea? Submit a Feature Request.
