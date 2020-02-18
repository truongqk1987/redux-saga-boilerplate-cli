let _config = {};
const cliPath = process.env.PWD || process.cwd();
let _args = {};

module.exports.getConfig = () => {
    return _config;
}

module.exports.setConfig = (config) => {
    _config = config;
}

module.exports.setConfigValue = (configKey, configValue) => {
    _config[configKey] = configValue;
}

module.exports.getConfigValue = (configKey) => {
    return _config[configKey];
}

module.exports.getArgs = () => {
    return _args;
}

module.exports.setArgs = (args) => {
    _args = args;
}

module.exports.getArgValue = (argKey) => {
    return _args[argKey];
}

module.exports.setArgValue = (argKey, argValue) => {
    _args[argKey] = argValue;
}

module.exports.getCLIPath = () => {
    return cliPath;
}