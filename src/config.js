const path = require('path');
const fs = require("fs-extra");
const { setConfig, getCLIPath, getArgs, setArgs, getConfig, getArgValue } = require('./share-objects');

const defaultConfig = require('./defaultConfig');

module.exports.loadCLIConfig = async () => {
    let config = {...defaultConfig};
    const projectConfigPath = getArgValue('config');

    try {
        if (projectConfigPath) {
            const projectConfig = await fs.readJson(path.join(getCLIPath(), projectConfigPath))
            config = {...defaultConfig, ...projectConfig}
        }
    } catch(e) {
        console.log(e);
    } finally {
        setConfig(config);
    }
};

module.exports.loadModelsConfig = async () => {
    let modelsConfig = {};
    const { MODELS_CONFIG_FILE_PATH } = getConfig();
    const modelsConfigPath = getArgValue('models') || MODELS_CONFIG_FILE_PATH;
    
    try {
        if (modelsConfigPath) {
            modelsConfig = await fs.readJson(path.join(getCLIPath(), modelsConfigPath)) || {}
        }
    } catch(e) {
        console.log(e);
    } finally {
        setArgs({...getArgs(), modelsConfig})
    }
}