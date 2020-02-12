#!/usr/bin/env node
const reduxSagaCreator = require('./src/redux-saga-creator');
const yargs = require("yargs");
const makeDir = require("mk-dir");

const options = yargs
 .usage("Usage: metanet <option> <value>")
 .command("init", "Init Redux Saga project", {}, (argv) => {
     reduxSagaCreator.createInitFiles();
 })
 .option("c", { alias: "container", describe: "Container name", type: "string"})
 .option("o", { alias: "omit", describe: "Reject generate redux + saga", type: "boolean"})
 .option("e", { alias: "entity", describe: "Entity name", type: "string"})
 .argv;

const containerName = options.container;
const folderContainerPath = __dirname + "/src/containers/" + containerName;
const generateInContainerFolders = [
    'actions',
    'sagas',
    'reducers'
]
const generateEntityFileType = [
    'action', 'saga', 'reducer'
]

if (containerName) {
    (async () => {
        const paths = await Promise.all(generateInContainerFolders.map(folderName => 
            makeDir(folderContainerPath + '/' + folderName)
        ));
        if (!options.omit) {
            const entityName = options.entity || containerName.toLowerCase();
            generateEntityFileType.forEach(
                fileType => reduxSagaCreator.createFile(entityName, containerName, fileType))
        }
        

    })();
}

