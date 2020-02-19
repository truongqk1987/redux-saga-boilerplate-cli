const path = require("path");
const { lowerCaseFirst } = require("lower-case-first");

const { getConfig, getCLIPath, getArgValue } = require("../../global-store");

const {
  DEFAULT_PROJECT_SOURCE_PATH,
  DEFAULT_ROOT_CONTAINERS_PATH,
  DEFAULT_TEMPLATE_FILE_MAP_INFO,
} = require('./constants');

const buildTemplateFilePath = (templateName) => {
  const { PROJECT_TEMPLATE_FOLDER_PATH } = getConfig();
  return PROJECT_TEMPLATE_FOLDER_PATH ?
          path.join(getCLIPath(), PROJECT_TEMPLATE_FOLDER_PATH, `${templateName}.hbs`) :
            path.join(__dirname, 'templates', `${templateName}.hbs`);
};

const buildTargetFilePath = (fileName, templateName) => {
  const templateInfo = getTemplateInfo(templateName)
  const { parentFolderName, extension = ".js" } = templateInfo;
      return parentFolderName ? path.join(
        getContainerPath(), parentFolderName, `${lowerCaseFirst(fileName)}${extension}`)
        :
        path.join(
          getContainerPath(), `${lowerCaseFirst(fileName)}${extension}`)
};

const getContainerPath = () => {
  const { ROOT_CONTAINERS_PATH, PROJECT_SOURCE_PATH } = getConfig();
  const containerName = getArgValue('containerName');
  return containerName ?
    path.join(getCLIPath(), PROJECT_SOURCE_PATH || DEFAULT_PROJECT_SOURCE_PATH,
        ROOT_CONTAINERS_PATH || DEFAULT_ROOT_CONTAINERS_PATH, containerName) :
      path.join(getCLIPath(), PROJECT_SOURCE_PATH || DEFAULT_PROJECT_SOURCE_PATH);
}

const getTemplateInfo = (templateName) => {
  const { EXTEND_TEMPLATE_FILE_MAP_INFO = {} } = getConfig();
  const templateFileMap = {...DEFAULT_TEMPLATE_FILE_MAP_INFO, ...EXTEND_TEMPLATE_FILE_MAP_INFO };
  return templateFileMap[templateName];
}

module.exports = {
  buildTemplateFilePath,
  buildTargetFilePath,
  getContainerPath,
  getTemplateInfo
}
