const GENERATE_FROM_CONFIG_FILE = 0;
const GENERATE_FROM_USER_INPUTS = 1;
const { getCLIPath } = require('../share-objects');
module.exports = (plop) => {
    plop.setGenerator('generate-redux-saga-crud', {
        description: 'Generate redux saga crud files',
        prompts: [
            {
                type: 'list',
                name: 'generateCRUDFilesOption',
                message: "Please choose the way you create CRUD files: ",
                choices: [{
                    name: "Generate from config file",
                    value: GENERATE_FROM_CONFIG_FILE
                }, {
                    name: "Generate from user's inputs",
                    value: GENERATE_FROM_USER_INPUTS
                }]
            },
            {
                type: 'fuzzy-selector',
                name: 'modelsConfigFile',
                excludePath: nodePath => nodePath.startsWith('node_modules'),
                excludeFilter: nodePath => nodePath == '.',
                message: "Choose your models config file: ",
                rootPath: getCLIPath(),
                depthLimit: 2,
                itemType: 'file',
                when: (answer) => {
                    return answer.generateCRUDFilesOption === GENERATE_FROM_CONFIG_FILE;
                },
            },
            {
                type: 'confirm',
                name: 'hasContainerName',
                message: "Do your entity has a container name? ",
                when: (answers) => {
                    return answers.generateCRUDFilesOption === GENERATE_FROM_USER_INPUTS;
                },
            },
            {
                type: 'input',
                name: 'containerName',
                message: "Your container name is: ",
                when: (answers) => {
                    const { hasContainerName, generateCRUDFilesOption} = answers;
                    return hasContainerName && generateCRUDFilesOption === GENERATE_FROM_USER_INPUTS;
                },
            },
            {
                type: 'input',
                name: 'entitiesName',
                message: "Your entities are (Ex: Entity-1 Entity-2 Entity-3): ",
                when: (answers) => {
                    return answers.generateCRUDFilesOption === GENERATE_FROM_USER_INPUTS;
                },
                validate: (value) => {
                    console.log(value);
                }
            }
        ],
        actions: [{}]
    })
}