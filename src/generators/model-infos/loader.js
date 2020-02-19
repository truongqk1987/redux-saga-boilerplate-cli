const path = require("path");
const fs = require("fs-extra");

const {
  setConfig,
  getCLIPath,
  getArgs,
  setArgs,
  getConfig,
  getArgValue
} = require("../../global-store");
const defaultConfig = require("../../defaultConfig.json");
const { isNodeLibExisted } = require("./utils");
const {
  DEFAULT_INIT_REDUX_SAGA_FILES_CONFIG,
  DEFAULT_REQUIRED_LIBS
} = require("../redux-saga-files/constants");

// module.exports.loadCLIConfig = async () => {
//   let config = { ...defaultConfig };
//   const projectConfigPath = getArgValue("config");

//   try {
//     if (projectConfigPath) {
//       const projectConfig = await fs.readJson(
//         path.join(getCLIPath(), projectConfigPath)
//       );
//       config = { ...defaultConfig, ...projectConfig };
//     }
//   } catch (e) {
//     console.log(e);
//   } finally {
//     setConfig(config);
//   }
// };

// module.exports.loadModelsConfig = async () => {
//   let modelsConfig = {};
//   const { MODELS_CONFIG_FILE_PATH } = getConfig();
//   const modelsConfigPath = getArgValue("models") || MODELS_CONFIG_FILE_PATH;

//   try {
//     if (modelsConfigPath) {
//       modelsConfig =
//         (await fs.readJson(path.join(getCLIPath(), modelsConfigPath))) || {};
//     }
//   } catch (e) {
//     console.log(e);
//   } finally {
//     setArgs({ ...getArgs(), modelsConfig });
//   }
// };

const loadRequiredLibs = async () => {
  const { EXTEND_REQUIRED_LIBS = [] } = getConfig();
  const requiredLibs = [...DEFAULT_REQUIRED_LIBS, ...EXTEND_REQUIRED_LIBS];
  const uninstallLibs = await requiredLibs.filter(
    async libName => {
      const isInstalled = await isNodeLibExisted(libName);
      return !isInstalled
    }
  );
  console.log("Install required libs");
  const spawn = require("cross-spawn");
  const childProcess = spawn("yarn", ["add", ...uninstallLibs], {stdio: 'inherit'});
  childProcess.on('close', function (code) {
    if (code === 0) {
      console.log("Finished installation.");
    }
  })
  
};

module.exports = {
  loadRequiredLibs
}

