const path = require('path');
const fs = require("fs-extra");
const { setConfig } = require('./share-objects');

const defaultConfig = require('./defaultConfig');

const pwd = process.env.PWD || process.cwd(); // folder where command start

module.exports.loadConfig = async (args) => {
    let config = {...defaultConfig};
    const customConfigRelativePath = args['config'];

    try {
        if (customConfigRelativePath) {
            const pathCustomConfigFile = path.join(pwd, customConfigRelativePath);
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