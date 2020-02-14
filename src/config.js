const path = require('path');
const fs = require("fs-extra");
const { setConfig, getCLIPath, getArgs, setArgs } = require('./share-objects');

const defaultConfig = require('./defaultConfig');

module.exports.loadConfig = async () => {
    let config = {...defaultConfig};
    const customConfigRelativePath = getArgs()['config'];

    try {
        if (customConfigRelativePath) {
            const pathCustomConfigFile = path.join(getCLIPath(), customConfigRelativePath);
            const customConfig = await fs.readJson(pathCustomConfigFile)
            config = {...defaultConfig, ...customConfig}
        }
    } catch(e) {
        console.log(e);
    } finally {
        setConfig(config);
    }
};

module.exports.loadModelsConfig = async () => {
    let modelsConfigFilePath;
    let entityModelConfig = {};
    const { MODELS_CONFIG_FILE_PATH } = getArgs()['config'] || {};
    const inputModelsConfigFilePath = getArgs()['models'];
    modelsConfigFilePath = inputModelsConfigFilePath || MODELS_CONFIG_FILE_PATH;
    try {
        if (modelsConfigFilePath) {
            const readModelsConfigFilePath = path.join(getCLIPath(), modelsConfigFilePath);
            const modelsConfigContent = await fs.readJson(readModelsConfigFilePath)
            entityModelConfig = {...modelsConfigContent}
        }
    } catch(e) {
        console.log(e);
    } finally {
        setArgs({...getArgs(), entityModelConfig, isEntitiesLoadFromConfigFile: true})
    }
}