const path = require("path");
const isEmpty = require('lodash.isempty');

const { getConfig, getCLIPath, getArgValue } = require("../../global-store");

const {
  DEFAULT_PROJECT_SOURCE_PATH,
  DEFAULT_ROOT_CONTAINERS_PATH,
  DEFAULT_TEMPLATE_FILE_MAP_INFO,
  DEFAULT_PROJECT_TEMPLATES_PATH
} = require('../../constants');

const buildTemplateFilePath = (templateName) => {
  const { PROJECT_TEMPLATES_PATH } = getConfig();
  const defaultTemplatePath = path.join(__dirname, DEFAULT_PROJECT_TEMPLATES_PATH, `${templateName}.hbs`);
  if (PROJECT_TEMPLATES_PATH) {
    
    const projectTemplateFilenames = getArgValue('projectTemplateFilenames');
    
    if (!isEmpty(projectTemplateFilenames)) {
      if (projectTemplateFilenames.includes(templateName)) {
        return path.join(getCLIPath(), PROJECT_TEMPLATES_PATH, `${templateName}.hbs`)
      }
    }
  }
  return defaultTemplatePath;
};

const buildTargetFilePath = (fileName, templateName) => {
  const templateInfo = getTemplateInfo(templateName)
  const { parentFolderName, extension = ".js" } = templateInfo;
      return parentFolderName ? path.join(
        getContainerPath(), parentFolderName, `${fileName}${extension}`)
        :
        path.join(
          getContainerPath(), `${fileName}${extension}`)
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
