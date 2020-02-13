const path = require("path");

const { getCLIPath } = require('./share-objects');

module.exports.isExistLibInNodeModules = (libName) => {
  try {
    const instance = require(path.join(getCLIPath(), "node_modules", libName));
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
};




