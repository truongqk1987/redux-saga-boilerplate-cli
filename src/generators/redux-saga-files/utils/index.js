const path = require("path");
const fileExists = require('file-exists');

const { getCLIPath } = require('../../../global-store');

const isNodeLibExisted = (libName) => {
  try {
    require(path.join(getCLIPath(), "node_modules", libName));
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
};

const isStartAtProjectRoot = async() => {
  const isExistedPackageJSON = await fileExists(path.join(getCLIPath(), 'package.json'));
  if (isExistedPackageJSON) return true;
  else {
    console.log('Please run CLI at project folder');
    return false;
  }
}

const addFile = (templateFile, path) => ({
  path,
  templateFile,
  type: "add",
  skipIfExists: true
});

module.exports = {
    addFile,
    isStartAtProjectRoot,
    isNodeLibExisted,
}