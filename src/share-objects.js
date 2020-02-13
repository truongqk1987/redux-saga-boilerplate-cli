let _config = {};
const cliPath = process.env.PWD || process.cwd();

module.exports.getConfig = () => {
    return _config;
}

module.exports.setConfig = (config) => {
    _config = config;
}

module.exports.getCLIPath = () => {
    return cliPath;
}