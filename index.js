#!/usr/bin/env node
const yargs = require("yargs");
const path = require('path');

const { setGlobalPlop } = require('./src/global-store');
const { createProject, generateCRUD } = require('./src/commands');

const nodePlop = require('node-plop');
// load an instance of plop from a plopfile
const plop = nodePlop(path.join(__dirname, 'plopfile.js'));

setGlobalPlop(plop);

yargs
  .command(...createProject())
  .command(...generateCRUD())
  .argv;

