/**
 * File path prompt example
 */

"use strict";
var inquirer = require("inquirer");
inquirer.registerPrompt("filePath", require("./index"));

inquirer
  .prompt([
    {
      type: "filePath",
      name: "path",
      message: "What JSON file would you like to load?",
      basePath: "./test"
    }
  ])
  .then(answers => {
    console.log("[result]", JSON.stringify(answers, null, "  "));
  });
