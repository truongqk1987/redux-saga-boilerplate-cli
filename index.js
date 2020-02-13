#!/usr/bin/env node
const reduxSagaCreator = require('./src/redux-saga-creator');
const yargs = require("yargs");
const makeDir = require("mk-dir");

yargs
 .command("$0", '', (yargs) => {
    return yargs.usage("Usage: metanet <command>")
 }, () => {})
 .command("redux-saga <container-name>", "Generate Action, Saga, Reducer in container folder",
    (yargs) => {
        return yargs.positional('container-name', {
                        describe: 'Name of container',
                        type: 'string',
                    })
                    .option("e", { alias: "entity", describe: "Entity name", type: "string"})
                    .option("i", { alias: "init", describe: "Init basic redux-saga files (store, root of sagas and reducers)", type: "boolean"})
                    .usage("Usage: redux-saga <container-name> [otpions] [value]")
    }, (args) => {
        const containerName = args['container-name'];
        const isInit = args.init;
        const folderContainerPath = process.env.PWD + "/src/containers/" + containerName;
        const generateInContainerFolders = [
            'actions',
            'sagas',
            'reducers'
        ]
        const generateEntityFileType = [
            'action', 'saga', 'reducer'
        ]

        if (isInit) {
            reduxSagaCreator.createInitFiles();
        } else if (containerName) {
            (async () => {
                const paths = await Promise.all(generateInContainerFolders.map(folderName => 
                    makeDir(folderContainerPath + '/' + folderName)
                ));
                if (args.entity) {
                    const entityName = args.entity || containerName.toLowerCase();
                    generateEntityFileType.forEach(
                        fileType => reduxSagaCreator.createFile(entityName, containerName, fileType))
                }
            })();
        }
    }
 )
 .argv;



