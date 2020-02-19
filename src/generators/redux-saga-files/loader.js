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
const { isExistLibInNodeModules } = require("./utils");
const {
  DEFAULT_INIT_REDUX_SAGA_FILES_CONFIG,
  DEFAULT_REQUIRED_LIBS
} = require("./constants");

module.exports.loadCLIConfig = async () => {
  let config = { ...defaultConfig };
  const projectConfigPath = getArgValue("config");

  try {
    if (projectConfigPath) {
      const projectConfig = await fs.readJson(
        path.join(getCLIPath(), projectConfigPath)
      );
      config = { ...defaultConfig, ...projectConfig };
    }
  } catch (e) {
    console.log(e);
  } finally {
    setConfig(config);
  }
};

module.exports.loadModelsConfig = async () => {
  let modelsConfig = {};
  const { MODELS_CONFIG_FILE_PATH } = getConfig();
  const modelsConfigPath = getArgValue("models") || MODELS_CONFIG_FILE_PATH;

  try {
    if (modelsConfigPath) {
      modelsConfig =
        (await fs.readJson(path.join(getCLIPath(), modelsConfigPath))) || {};
    }
  } catch (e) {
    console.log(e);
  } finally {
    setArgs({ ...getArgs(), modelsConfig });
  }
};

module.exports.loadRequiredLibs = () => {
  const { EXTEND_REQUIRED_LIBS = [] } = getConfig();
  const requiredLibs = [...DEFAULT_REQUIRED_LIBS, ...EXTEND_REQUIRED_LIBS];
  const uninstallLibs = requiredLibs.filter(
    libName => !isExistLibInNodeModules(libName)
  );
  const spawn = require("cross-spawn");
  spawn("yarn", ["add", ...uninstallLibs]);
};

module.exports = {
  
}

