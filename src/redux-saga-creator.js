const isEmpty = require('lodash.isempty');
const fileExists = require('file-exists');
const path = require('path');

const { loadConfig, loadModelsConfig } = require("./config");

const {
  buildTemplateFilePath, copyTemplate, buildTargetFilePath,
  getTemplateInfo,
  makeReduxSagaFolders
} = require("./template-builder");
const { getArgs, getConfig, setArgs, getCLIPath } = require('./share-objects');
const { loadRequiredLibs, getInitReduxSagaFileNames } = require('./loader');
const {
  TARGET_FILE_IN_ROOT_FOLDER,
  TARGET_FILE_IN_SPECIFIC_CONTAINER_FOLDER,
  DEFAULT_REDUX_SAGA_TEMLATE_FILES
} = require('./constants');

async function initReduxSaga() {
  const isRequestInitReduxSaga = getArgs()['init'];
  if (isRequestInitReduxSaga){
    getInitReduxSagaFileNames().forEach(async (fileName) => {
      const templateFilePath = await buildTemplateFilePath(fileName);
      const targetFilePath = await buildTargetFilePath(fileName, TARGET_FILE_IN_ROOT_FOLDER)
      copyTemplate(
        templateFilePath,
        targetFilePath,
        fileName
      );
    })
  }
}

const generateFileFromTemplate = async (
  templateName,
  buildFileName
) => {

  const targetFilePath = await 
    buildTargetFilePath(
      buildFileName, TARGET_FILE_IN_SPECIFIC_CONTAINER_FOLDER, getTemplateInfo(templateName));
  
  copyTemplate(
    buildTemplateFilePath(templateName),
    targetFilePath,
    templateName,
    buildFileName
  );
};

const generateReduxSagaFilesByEntityName = (entityName) => {
  const { EXTEND_REDUX_SAGA_TEMLATE_FILES = [] } = getConfig();
  const reduxSagaTemplates = [
      ...DEFAULT_REDUX_SAGA_TEMLATE_FILES,
      ...EXTEND_REDUX_SAGA_TEMLATE_FILES
  ]
  reduxSagaTemplates.forEach(templateName =>
    generateFileFromTemplate(templateName, entityName)
  );
}

const generateReduxSagaFiles = async () => {
  let entityNames = getArgs().entities;
  if (!isEmpty(entityNames)) {
    entityNames.forEach(generateReduxSagaFilesByEntityName)
  }
}

const generateReduxSagaFilesFromModelsConfig = async() => {
  const entityModelConfig = getArgs().entityModelConfig;
  let containerNames = Object.keys(entityModelConfig);
  if (!isEmpty(containerNames)) {
    containerNames.forEach((container) => {
      Object.keys(entityModelConfig[container]).forEach(entityName => {
        const entityAttributes = Object.keys(entityModelConfig[container][entityName]);
        const containerName = container === '<share>' ? "" : container;
        setArgs({...getArgs(), container: containerName, entityAttributes, activeEntity: entityModelConfig[container][entityName]});
        generateReduxSagaFilesByEntityName(entityName);
      })
    })
  }
}

const initilizeGenerator = async () => {
  await loadConfig();
  const isExistRootFolder = await fileExists(path.join(getCLIPath(), 'package.json'));
  
  if (isExistRootFolder) {
    loadRequiredLibs();

    initReduxSaga();

    await makeReduxSagaFolders();
  } else {
    console.log('Please run command from project folder!');
  }
}

module.exports = {
  createFiles: async () => {
    await initilizeGenerator();
    generateReduxSagaFiles();
  },

  createFilesFromModelsConfig: async () => {
    await initilizeGenerator();
    await loadModelsConfig();
    generateReduxSagaFilesFromModelsConfig();
  }
};
