const copydir = require('copy-dir');
const path = require('path');

const { DEFAULT_PROJECT_SOURCE_PATH } = require('../redux-saga-files/constants');
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
        const crudFilesGenerator = getGlobalPlop().getGenerator('redux-saga-files');
        try {
            for (let index in entityNames) {
                const crudArg = {
                    entityName: entityNames[index],
                    containerName
                }
                await crudFilesGenerator.runActions(crudArg)
            }
        } catch (error) {
            console.log(error);
        }
        
    })
    plop.setActionType('loadInitReduxSagaFiles', async () => {
        try {
          const { PROJECT_SOURCE_PATH } = getConfig();
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