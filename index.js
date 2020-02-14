#!/usr/bin/env node
const yargs = require("yargs");

const reduxSagaCreator = require("./src/redux-saga-creator");
const { setArgs } = require('./src/share-objects');

yargs
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
      .option("i", {
        alias: "init",
        describe: "Init files for Redux Saga (store, rootReducer, rootSaga)",
        type: "boolean"
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
      reduxSagaCreator.createFiles();
    }
  )
  .command('redux-saga-models', "Generate redux, saga files from models config",
    yargs => {
      return yargs.option('m', {
        alias: 'models',
        describe: "Location of model file",
        type: "string"
      })
      .option("i", {
        alias: "init",
        describe: "Init files for Redux Saga (store, rootReducer, rootSaga)",
        type: "boolean"
      })
      .option('config', {
        describe: "Location of config file",
        type: "string"
      })
      .usage("Usage: redux-saga-models [otpions] [value]")
    },
    args => {
      setArgs(args);
      reduxSagaCreator.createFilesFromModelsConfig();
    }
  )
  .argv;
