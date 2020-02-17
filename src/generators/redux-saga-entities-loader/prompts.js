const { getCLIPath } = require('../../global-store');
const {GENERATE_FROM_CONFIG_FILE, GENERATE_FROM_USER_INPUTS} = require('./constants');
const { loadModelsConfig } = require('./utils');


module.exports = [
    {
        type: 'list',
        name: 'generateCRUDOption',
        message: "Please choose the way you create CRUD files: ",
        choices: [{
            name: "Generate from config file",
            value: GENERATE_FROM_CONFIG_FILE
        }, {
            name: "Generate from user's inputs",
            value: GENERATE_FROM_USER_INPUTS
        }],
        default: GENERATE_FROM_USER_INPUTS
    },
    {
        type: 'fuzzy-selector',
        name: 'modelsConfig',
        excludePath: nodePath => nodePath.startsWith('node_modules'),
        excludeFilter: nodePath => nodePath == '.',
        message: "Choose your models config file: ",
        rootPath: getCLIPath(),
        depthLimit: 2,
        itemType: 'file',
        when: (answer) => {
            return answer.generateCRUDOption === GENERATE_FROM_CONFIG_FILE;
        },
        filter: loadModelsConfig
    },
    {
        type: 'confirm',
        name: 'hasContainerName',
        message: "Do your entity has a container name? ",
        when: (answers) => {
            return answers.generateCRUDOption === GENERATE_FROM_USER_INPUTS;
        },
        default: 'Y',
    },
    {
        type: 'input',
        name: 'containerName',
        message: "Your container name is: ",
        when: (answers) => {
            const { hasContainerName, generateCRUDOption} = answers;
            return hasContainerName && generateCRUDOption === GENERATE_FROM_USER_INPUTS;
        },
    },
    {
        type: 'input',
        name: 'entityNames',
        message: "Your entities are: ",
        when: (answers) => {
            return answers.generateCRUDOption === GENERATE_FROM_USER_INPUTS;
        },
        filter: (entityNamesStr) => {
            return entityNamesStr && entityNamesStr.split(" ")
        },
        default: []
    }
]