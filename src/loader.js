
const { isExistLibInNodeModules } = require('./utils');
const { getConfig } = require('./share-objects');
const { DEFAULT_INIT_REDUX_SAGA_FILES, DEFAULT_REQUIRED_LIBS } = require('./constants');

module.exports.loadRequiredLibs = () => {
    const { EXTEND_REQUIRED_LIBS = [] } = getConfig();
    const requiredLibs = [
      ...DEFAULT_REQUIRED_LIBS,
      ...EXTEND_REQUIRED_LIBS
    ];
    const uninstallLibs = requiredLibs.filter((libName) => !isExistLibInNodeModules(libName));
    const spawn = require('cross-spawn');
    spawn('yarn', ['add',
      ...uninstallLibs
    ]);
  }

module.exports.getInitReduxSagaFileNames = () => {
    const { EXTEND_INIT_REDUX_SAGA_FILES = [] } = getConfig();
    return [
        ...DEFAULT_INIT_REDUX_SAGA_FILES,
        ...EXTEND_INIT_REDUX_SAGA_FILES
    ]
}