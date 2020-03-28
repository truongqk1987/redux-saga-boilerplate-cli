const { isNodeLibExisted } = require("./utils");
const {
  DEFAULT_REQUIRED_LIBS
} = require("../../constants");

const loadRequiredLibs = async () => {
  const requiredLibs = [...DEFAULT_REQUIRED_LIBS];
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

