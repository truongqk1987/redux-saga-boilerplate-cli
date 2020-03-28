const { getCLIPath } = require('../../global-store');
const { loadModelsJSON } = require('./utils');


module.exports = [
    {
        type: 'fuzzy-selector',
        name: 'modelsJSON',
        excludePath: nodePath => nodePath.startsWith('node_modules'),
        excludeFilter: nodePath => nodePath == '.',
        message: "Choose your models config file: ",
        rootPath: getCLIPath(),
        depthLimit: 2,
        itemType: 'file',
        filter: loadModelsJSON
    }
]