const fs = require("fs-extra");
const fileExists = require('file-exists');
const { lowerCaseFirst } = require("lower-case-first");
const { upperCaseFirst } = require("upper-case-first");
const path = require('path');
const makeDir = require("mkdirp");

const { getConfig, getArgs, getCLIPath } = require("./share-objects");
const {
  renderEntityPropTypes,
} = require('./renderer');

const {
  TARGET_FILE_IN_ROOT_FOLDER, DEFAULT_REDUX_SAGA_FOLDERS,
  TARGET_FILE_IN_SPECIFIC_CONTAINER_FOLDER,
  DEFAULT_TEMPLATE_FILE_MAP_INFO
} = require('./constants');

const replaceByEntityName = async (filePath, entityName) => {
  if (entityName) {
    const { ENCODING, BASE_API } = getConfig();

    const fileContent = await fs.readFile(filePath, ENCODING);

    const result = fileContent
      .replace(/'<nameOf>'/g, lowerCaseFirst(entityName))
      .replace(/'<NameOf>'/g, upperCaseFirst(entityName))
      .replace(/'<nameof>'/g, entityName.toLowerCase())
      .replace(/'<NAMEOF>'/g, entityName.toUpperCase())
      .replace(/'<BaseAPI>'/g, BASE_API)
      .replace(/'<prop-types-placeholder>'/, renderEntityPropTypes(entityName))

    await fs.writeFile(filePath, result, ENCODING);
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

const buildTargetFilePath = (fileName, type, templateInfo) => {
  let targetFilePath = "";
  
  const { ROOT_FOLDER_PATH } = getConfig();
  switch (type) {
    case TARGET_FILE_IN_ROOT_FOLDER: 
      targetFilePath = path.join(getCLIPath(),
        ROOT_FOLDER_PATH, fileName + '.js');
      break;
    case TARGET_FILE_IN_SPECIFIC_CONTAINER_FOLDER:
      const { parentFolderName, extension } = templateInfo;
      targetFilePath = path.join(getContainerPath(), parentFolderName, lowerCaseFirst(fileName) + extension)
      break;
  }
  
  return targetFilePath
};

const getContainerPath = () => {
  const { ROOT_CONTAINERS_FOLDER_PATH, ROOT_FOLDER_PATH } = getConfig();
 
  const containerName = getArgs()["container"];
  return containerName ?
    path.join(getCLIPath(), ROOT_CONTAINERS_FOLDER_PATH, containerName) :
    path.join(getCLIPath(), ROOT_FOLDER_PATH);
}

const makeReduxSagaFolders = async () => {
  const { EXTEND_REDUX_SAGA_FOLDERS = [] } = getConfig();
  const reduxSagaFolderNames = [...DEFAULT_REDUX_SAGA_FOLDERS, ...EXTEND_REDUX_SAGA_FOLDERS];
  await Promise.all(
    reduxSagaFolderNames.map(folderName =>
      makeDir(path.join(getContainerPath(), folderName))
    )
  );
}

const getTemplateInfo = (templateName) => {
  const { EXTEND_TEMPLATE_FILE_MAP_INFO = {} } = getConfig();
  const templateFileMap = {...DEFAULT_TEMPLATE_FILE_MAP_INFO, ...EXTEND_TEMPLATE_FILE_MAP_INFO };
  return templateFileMap[templateName];
}

module.exports = {
  copyTemplate,
  replaceByEntityName, 
  buildTargetFilePath,
  buildTemplateFilePath,
  getContainerPath,
  makeReduxSagaFolders,
  getTemplateInfo
}
