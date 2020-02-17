#!/usr/bin/env node
const yargs = require("yargs");
const copydir = require('copy-dir');
const path = require('path');
const reduxSagaCreator = require("./src/redux-saga-creator");
const { setArgs, getCLIPath } = require('./src/share-objects');
const createProjectCLIDefinition = require('./src/cli-definitions/create-project');
const generateReduxSagaCRUDCLIDefinition = require('./src/cli-definitions/generate-redux-saga-crud');

const nodePlop = require('node-plop');
// load an instance of plop from a plopfile
const plop = nodePlop(path.join(__dirname, 'plopfile.js'));
yargs
  .command(...createProjectCLIDefinition())
  .command(...generateReduxSagaCRUDCLIDefinition(plop))
  .command(
    "redux-saga",
    "Generate redux, saga files from array model names",
    yargs => {
      return yargs
      .option("c", {
        alias: 'container',
        describe: "Name of container",
        type: "string"
      })
      .option("e", {
        alias: "entities",
        describe: "Entity name",
        type: "array"
      })
      .option('config', {
        describe: "Location of config file",
        type: "string"
      })
      .usage("Usage: redux-saga [container] [otpions] [value]")
      .showHelpOnFail(false, "Specify --help for available options");
    },
    args => {
      setArgs(args);
      reduxSagaCreator.generateCRUD();
    }
  )
  .command('redux-saga-models', "Generate redux, saga files from models config",
    yargs => {
      return yargs.option('m', {
        alias: 'models',
        describe: "Location of model file",
        type: "string"
      })
      .option('config', {
        describe: "Location of config file",
        type: "string"
      })
      .usage("Usage: redux-saga-models [otpions] [value]")
    },
    args => {
      setArgs(args);
      reduxSagaCreator.generateCRUDByConfig();
    }
  )
  .argv;

