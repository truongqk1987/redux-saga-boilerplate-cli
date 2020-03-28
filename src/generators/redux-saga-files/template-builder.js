const path = require("path");

const { getCLIPath } = require("../../global-store");

const {
  DEFAULT_PROJECT_SOURCE_PATH,
  DEFAULT_ROOT_CONTAINERS_PATH,
  DEFAULT_TEMPLATE_FILE_MAP_INFO,
} = require('../../constants');

const buildTargetFilePath = (templateName, {entity, container}) => {
  const templateInfo = DEFAULT_TEMPLATE_FILE_MAP_INFO[templateName]
  const { parentFolder, extension = ".js" } = templateInfo;
      return parentFolder ? path.join(
        getContainerPath(container), parentFolder, `${entity}${extension}`)
        :
        path.join(
          getContainerPath(container), `${entity}${extension}`)
};

const getContainerPath = (container) => {
  return container !== "*" ?
    path.join(getCLIPath(), DEFAULT_PROJECT_SOURCE_PATH,
        DEFAULT_ROOT_CONTAINERS_PATH, container) :
      path.join(getCLIPath(), DEFAULT_PROJECT_SOURCE_PATH);
}

module.exports = {
  buildTargetFilePath,
  getContainerPath,
}
