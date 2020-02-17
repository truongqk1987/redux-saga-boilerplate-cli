let _config = {};
const cliPath = process.env.PWD || process.cwd();
let _args = {};
let _globalPlop = {};

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

module.exports.setArgValue = (item) => {
    _args = {..._args, ...item};
}

module.exports.getCLIPath = () => {
    return cliPath;
}

module.exports.getGlobalPlop = () => {
    return _globalPlop;
}

module.exports.setGlobalPlop = (globalPlop) => {
    _globalPlop = globalPlop;
}