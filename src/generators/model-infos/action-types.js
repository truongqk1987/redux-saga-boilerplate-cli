const fs = require('fs-extra');
const path = require('path');

const { getGlobalPlop } = require('../../global-store');
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
}