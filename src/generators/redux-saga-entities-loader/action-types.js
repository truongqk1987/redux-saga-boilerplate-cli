const fs = require('fs-extra');
const path = require('path');

const { setArgValue, getGlobalPlop } = require('../../global-store');
const { generateCRUDByConfig, generateCRUDByInput } = require('../../crud-creator');
const {
    GENERATE_FROM_USER_INPUTS_ACTION_TYPE,
    GENERATE_FROM_CONFIG_FILE_ACTION_TYPE
} = require('./constants'); 

const { buildCRUDGenArgsListByConfig } = require('./utils');

module.exports = (plop) => {
    const _plop = plop;
    plop.setActionType(GENERATE_FROM_CONFIG_FILE_ACTION_TYPE, async ({ modelsConfig }) => {
        const crudFilesGenerator = getGlobalPlop().getGenerator('redux-saga-files-generator');
        try {
            buildCRUDGenArgsListByConfig(modelsConfig).forEach(
                async genArgs => await crudFilesGenerator.runActions(genArgs)
            );
        } catch (error) {
            console.log(error);
        }
        
    })
    plop.setActionType(GENERATE_FROM_USER_INPUTS_ACTION_TYPE, async ({ containerName, entityNames }, config, plop) => {
        setArgValue({ entityNames, containerName });
        generateCRUDByInput();
    })
}