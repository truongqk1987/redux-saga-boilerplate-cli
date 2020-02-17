const fs = require("fs-extra");
const path = require("path");
const fileExists = require('file-exists');
const { lowerCaseFirst } = require("lower-case-first");

const { getConfig, getCLIPath, getArgValue } = require("./global-store");
const {
  ContentBuilder
} = require('./renderer');

const {
  DEFAULT_ROOT_PROJECT_SOURCE_PATH,
  DEFAULT_ROOT_CONTAINERS_PATH,
  DEFAULT_TEMPLATE_FILE_MAP_INFO,
  DEFAULT_ENCODING,
} = require('./constants');

const replaceByEntityName = async (filePath, entityName) => {
  if (entityName) {
    const { ENCODING } = getConfig();

    const fileContent = await fs.readFile(filePath, ENCODING || DEFAULT_ENCODING);
    if (fileContent) {
      //const result = replaceName(replaceURL(replaceEntityComponent(fileContent, entityName)), entityName);
      const result = ContentBuilder(entityName, fileContent)
      .buildName().buildURL().buildEntityCompPropTypes().finish();

      await fs.writeFile(filePath, result, ENCODING);
    }
  }
};

const copyTemplate = async (templateFilePath, targetFilePath, templateFileName, entityName) => {
  const isTargetFileExist = await fileExists(targetFilePath);
  const isTemplateFileExist = await fileExists(templateFilePath);
  if (!isTargetFileExist) {
    if (isTemplateFileExist) {
      await fs.copy(
        templateFilePath,
        targetFilePath
      );
    } else {
      const defaultTemplateFilePath = path.join(__dirname, 'templates/redux-saga', templateFileName + '.tpl');
      const isRequiredTemplateFileExistedInDefault = await fileExists(
        defaultTemplateFilePath
      );
      if (isRequiredTemplateFileExistedInDefault) {
        await fs.copy(
          defaultTemplateFilePath,
          targetFilePath
        );
      }
    }
  }
  replaceByEntityName(targetFilePath, entityName);
};

const buildTemplateFilePath = (templateFileName) => {
  const { CUSTOM_TEMPLATE_FOLDER_PATH } = getConfig();
  return CUSTOM_TEMPLATE_FOLDER_PATH ?
          path.join(getCLIPath(), CUSTOM_TEMPLATE_FOLDER_PATH, templateFileName + '.tpl') :
            path.join(__dirname, 'templates/redux-saga', templateFileName + '.tpl');
};

const buildTargetFilePath = (fileName, templateInfo) => {
  const { container: crudContainerPath, extension = ".js" } = templateInfo;
  const targetContainerFilePath = crudContainerPath ?
        path.join(getContainerPath(), crudContainerPath) :
          path.join(getContainerPath());
      return path.join(targetContainerFilePath, lowerCaseFirst(fileName) + extension)
};

const buildInitFilePath = (fileName, containerRalativePath) => {
  return path.join(getCLIPath(), containerRalativePath, fileName + '.js');
}

const getContainerPath = () => {
  const { ROOT_CONTAINERS_PATH, ROOT_PROJECT_SOURCE_PATH } = getConfig();
 
  const containerName = getArgValue("container");
  return containerName ?
    path.join(getCLIPath(), ROOT_CONTAINERS_PATH || DEFAULT_ROOT_CONTAINERS_PATH, containerName) :
      path.join(getCLIPath(), ROOT_PROJECT_SOURCE_PATH || DEFAULT_ROOT_PROJECT_SOURCE_PATH);
}

const getTemplateInfo = (templateName) => {
  const { EXTEND_TEMPLATE_FILE_MAP_INFO = {} } = getConfig();
  const templateFileMap = {...DEFAULT_TEMPLATE_FILE_MAP_INFO, ...EXTEND_TEMPLATE_FILE_MAP_INFO };
  return templateFileMap[templateName];
}

module.exports = {
  replaceByEntityName, 
  copyTemplate,
  buildTemplateFilePath,
  buildTargetFilePath,
  buildInitFilePath,
  getContainerPath,
  getTemplateInfo
}
