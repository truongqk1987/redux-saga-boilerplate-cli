const fs = require("fs-extra");
const fileExists = require('file-exists');
const { lowerCaseFirst } = require("lower-case-first");
const { upperCaseFirst } = require("upper-case-first");
const path = require('path');

const { getConfig, getArgs, getCLIPath } = require("./share-objects");
const { TARGET_FILE_IN_ROOT_FOLDER } = require('./constants');

const replaceByEntityName = async (filePath, entityName) => {
  const { ENCODING, BASE_API } = getConfig();

  const fileContent = await fs.readFile(filePath, ENCODING);

  const result = fileContent
    .replace(/'<nameOf>'/g, lowerCaseFirst(entityName))
    .replace(/'<NameOf>'/g, upperCaseFirst(entityName))
    .replace(/'<nameof>'/g, entityName.toLowerCase())
    .replace(/'<NAMEOF>'/g, entityName.toUpperCase())
    .replace(/'<BaseAPI>'/g, BASE_API);

  await fs.writeFile(filePath, result, ENCODING);
};

const copyTemplate = async (templateFilePath, targetFilePath) => {
  const entityName = getArgs().entity;
  const isTargetFileExist = await fileExists(targetFilePath);
  const isTemplateFileExist = await fileExists(templateFilePath);
  if (!isTargetFileExist) {
    if (isTemplateFileExist) {
      await fs.copy(
        templateFilePath,
        targetFilePath
      );
    }
  }
  replaceByEntityName(targetFilePath, entityName);
};

const buildTemplateFilePath = async (templateFileName) => {
  const { CUSTOM_TEMPLATE_FOLDER_PATH } = getConfig();
  return CUSTOM_TEMPLATE_FOLDER_PATH ?
          path.join(getCLIPath(), CUSTOM_TEMPLATE_FOLDER_PATH, templateFilePath) :
            path.join(__dirname, 'templates/redux-saga', templateFileName + '.tpl');
};

const buildTargetFilePath = async (fileName, type) => {
  let targetFilePath = "";
  const { ROOT_FOLDER } = getConfig();
  switch (type) {
    case TARGET_FILE_IN_ROOT_FOLDER: 
      targetFilePath = path.join(getCLIPath(),
        ROOT_FOLDER, fileName + '.js');
      break;
  }
  
  return targetFilePath
};

module.exports = {
  copyTemplate,
  replaceByEntityName, 
  buildTargetFilePath,
  buildTemplateFilePath
}
