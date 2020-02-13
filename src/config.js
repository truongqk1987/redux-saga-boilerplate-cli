const path = require('path');
const fs = require("fs-extra");
const { setConfig, getCLIPath, getArgs } = require('./share-objects');

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

    return config;
}