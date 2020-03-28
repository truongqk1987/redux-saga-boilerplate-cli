const copydir = require('copy-dir');
const path = require('path');

const { DEFAULT_PROJECT_SOURCE_PATH } = require('../../constants');
const { loadRequiredLibs } = require('./loader');
const { getGlobalPlop, getCLIPath } = require('../../global-store');


const { transformModelsJSON } = require('./utils');

module.exports = (plop) => {
    const _plop = plop;

    plop.setActionType('generate-models-from-json', async ({ modelsJSON }) => {
        const generator = getGlobalPlop().getGenerator('redux-saga-files');
        try {
            const transformedModelsJSON = transformModelsJSON(modelsJSON);
            await generator.runActions(transformedModelsJSON);
        } catch (error) {
            console.log(error);
        }
        
    })

    plop.setActionType('load-init-redux-saga-files', async () => {
        try {
          await copydir(
              path.join(__dirname, 'redux-saga-initialization'),
              path.join(getCLIPath(), DEFAULT_PROJECT_SOURCE_PATH),
              { cover: true },
              error => error && console.log(error)
          );
        } catch(error) {
            if (error) console.log(error);
        }
    })
    
    plop.setActionType('install-required-libs', async () => {
        await loadRequiredLibs();
    })
}