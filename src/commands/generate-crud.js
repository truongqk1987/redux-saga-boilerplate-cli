const path = require('path');
const fileExists = require('file-exists');

const { getGlobalPlop, getCLIPath } = require('../global-store');

const isStartAtProjectRoot = async() => {
    const isExistedPackageJSON = await fileExists(path.join(getCLIPath(), 'package.json'));
    if (isExistedPackageJSON) return true;
    else {
        console.log('Please run CLI at project folder');
        return false;
    }
}

module.exports = (plop) => [
        'generate-crud',
        'Generate redux-saga CRUD Entities',
        {},
        async () => {
            if (await isStartAtProjectRoot()) {
                const generator = getGlobalPlop().getGenerator('model-infos');
                const promptArgs = await generator.runPrompts();
                await generator.runActions(promptArgs);
            } 
        }
    ]