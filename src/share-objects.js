let _config = {};
const cliPath = process.env.PWD || process.cwd();
let _args = {};

module.exports.getConfig = () => {
    return _config;
}

module.exports.setConfig = (config) => {
    _config = config;
}

module.exports.getArgs = () => {
    return _args;
}

module.exports.setArgs = (args) => {
    _args = args;
}

module.exports.getCLIPath = () => {
    return cliPath;
}