#!/usr/bin/env node
const yargs = require("yargs");

const reduxSagaCreator = require("./src/redux-saga-creator");

yargs
  .command(
    "$0",
    "",
    yargs => {
      return yargs.usage("Usage: metanet <command>");
    },
    () => {}
  )
  .command(
    "redux-saga [container-name]",
    "Generate Action, Saga, Reducer in container folder",
    yargs => {
      return yargs
        .positional("container-name", {
          describe: "Name of container",
          type: "string"
        })
        .option("e", {
          alias: "entity",
          describe: "Entity name",
          type: "string"
        })
        .option("o", {
          alias: "override-template",
          describe: "Location of your folder templates to override default templates",
          type: "string"
        })
        .option("config", {
          describe: "Location of your generator config",
          type: "string"
        })
        .usage("Usage: redux-saga [container-name] [otpions] [value]");
    },
    args => {
      reduxSagaCreator.createFiles(args);
    }
  ).argv;
