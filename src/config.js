const path = require('path');
const fs = require("fs-extra");
const { setConfig, getCLIPath } = require('./share-objects');

const defaultConfig = require('./defaultConfig');

module.exports.loadConfig = async (args) => {
    let config = {...defaultConfig};
    const customConfigRelativePath = args['config'];

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