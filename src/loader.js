
const { isExistLibInNodeModules } = require('./utils');
const { getConfig } = require('./share-objects');
const { INIT_REDUX_SAGA_FILES } = require('./constants');

module.exports.loadRequiredLibs = () => {
    const { REQUIRED_LIBS = [] } = getConfig();
    const requiredLibs = [
      'redux',
      'redux-thunk',
      'redux-saga',
      'redux-devtools-extension',
      'axios',
      ...REQUIRED_LIBS
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
        ...INIT_REDUX_SAGA_FILES,
        ...EXTEND_INIT_REDUX_SAGA_FILES
    ]
}