const copydir = require('copy-dir');
const path = require('path');

const { DEFAULT_PROJECT_SOURCE_PATH } = require('./constants');
const { loadRequiredLibs } = require('./loader');
const { getGlobalPlop, getConfig, getCLIPath } = require('../../global-store');
const {
    GENERATE_FROM_USER_INPUTS_ACTION_TYPE,
    GENERATE_FROM_CONFIG_FILE_ACTION_TYPE
} = require('./constants'); 

const { genArgsListByConfig } = require('./utils');

module.exports = (plop) => {
    const _plop = plop;
    plop.setActionType(GENERATE_FROM_CONFIG_FILE_ACTION_TYPE, async ({ modelsConfig }) => {
        const crudFilesGenerator = getGlobalPlop().getGenerator('redux-saga-files');
        try {
            const crudArgsList = genArgsListByConfig(modelsConfig);
            for (let index in crudArgsList) {
                await crudFilesGenerator.runActions(crudArgsList[index])
            }
        } catch (error) {
            console.log(error);
        }
        
    })
    plop.setActionType(GENERATE_FROM_USER_INPUTS_ACTION_TYPE, async ({ containerName, entityNames }, config, plop) => {
        
    })
    plop.setActionType('loadInitReduxSagaFiles', async () => {
        console.log('Loadit');
        try {
          const { PROJECT_SOURCE_PATH = 'src' } = getConfig();
          await copydir(
              path.join(__dirname, 'redux-saga-initialization'),
              path.join(getCLIPath(), PROJECT_SOURCE_PATH || DEFAULT_PROJECT_SOURCE_PATH),
              { cover: false },
              error => error && console.log(error)
          );
        } catch(error) {
            if (error) console.log(error);
        }
      })
    
    plop.setActionType('installRequiredLibs', async () => {
        await loadRequiredLibs();
    })
}