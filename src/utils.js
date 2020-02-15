const path = require("path");
const fileExists = require('file-exists');

const { getCLIPath } = require('./share-objects');

module.exports.isExistLibInNodeModules = (libName) => {
  try {
    require(path.join(getCLIPath(), "node_modules", libName));
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
};

module.exports.isRunAtRootProject = async() => {
  const isExistedPackageJSON = await fileExists(path.join(getCLIPath(), 'package.json'));
  if (isExistedPackageJSON) return true;
  else {
    console.log('Please run CLI at project folder');
    return false;
  }
}




