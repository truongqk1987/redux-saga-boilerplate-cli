let _config = {};

module.exports.getConfig = () => {
    return _config;
}

module.exports.setConfig = (config) => {
    _config = config;
}