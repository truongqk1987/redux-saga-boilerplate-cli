const isEmpty = require("lodash.isempty");

const { loadMetanetCLIConfig, loadModelsConfig } = require("./config");

const {
  buildTemplateFilePath,
  copyTemplate,
  buildTargetFilePath,
  buildInitFilePath,
  getTemplateInfo
} = require("./template-builder");
const { getArgs, getConfig, setArgs } = require("./share-objects");
const { loadRequiredLibs, getInitFilesConfig } = require("./loader");
const {
  TARGET_FILE_IN_SPECIFIC_CONTAINER_FOLDER,
  DEFAULT_REDUX_SAGA_TEMLATE_FILES
} = require("./constants");

const { isRunAtRootProject } = require("./utils");

/* Copy template store, rootReducer, rootSaga into project folder */
async function initReduxSagaFiles() {
  const filesConfig = getInitFilesConfig();
  for (let templateFileName in filesConfig) {
    const {
      container: containerRelativePath,
      targetFileName,
    } = filesConfig[templateFileName];

    const copyFilePath = await buildTemplateFilePath(templateFileName);
    const targetFilePath = await buildInitFilePath(
      targetFileName || templateFileName,
      containerRelativePath
    );
    
    copyTemplate(copyFilePath, targetFilePath, templateFileName);
  }
}

const generateFileFromTemplate = async (templateName, buildFileName) => {
  const targetFilePath = await buildTargetFilePath(
    buildFileName,
    TARGET_FILE_IN_SPECIFIC_CONTAINER_FOLDER,
    getTemplateInfo(templateName)
  );

  copyTemplate(
    buildTemplateFilePath(templateName),
    targetFilePath,
    templateName,
    buildFileName
  );
};

const generateReduxSagaFilesByEntityName = entityName => {
  const { EXTEND_REDUX_SAGA_TEMLATE_FILES = [] } = getConfig();
  const reduxSagaTemplates = [
    ...DEFAULT_REDUX_SAGA_TEMLATE_FILES,
    ...EXTEND_REDUX_SAGA_TEMLATE_FILES
  ];
  reduxSagaTemplates.forEach(templateName =>
    generateFileFromTemplate(templateName, entityName)
  );
};

const generateReduxSagaFiles = async () => {
  let entityNames = getArgs().entities;
  if (!isEmpty(entityNames)) {
    entityNames.forEach(generateReduxSagaFilesByEntityName);
  }
};

const generateReduxSagaFilesFromModelsConfig = async () => {
  const entityModelConfig = getArgs().entityModelConfig;
  let containerNames = Object.keys(entityModelConfig);
  if (!isEmpty(containerNames)) {
    containerNames.forEach(container => {
      Object.keys(entityModelConfig[container]).forEach(entityName => {
        const entityAttributes = Object.keys(
          entityModelConfig[container][entityName]
        );
        const containerName = container === "<share>" ? "" : container;
        setArgs({
          ...getArgs(),
          container: containerName,
          entityAttributes,
          activeEntity: entityModelConfig[container][entityName]
        });
        generateReduxSagaFilesByEntityName(entityName);
      });
    });
  }
};

/* Load libs, make default folders, check pointer is at project folder */
const beforeCLIRunStep = async () => {
  if (isRunAtRootProject()) {
    await loadMetanetCLIConfig();
    loadRequiredLibs();
    initReduxSagaFiles();
  }
};

module.exports = {
  createFiles: async () => {
    await beforeCLIRunStep();
    generateReduxSagaFiles();
  },

  createFilesFromModelsConfig: async () => {
    await beforeCLIRunStep();
    await loadModelsConfig();
    generateReduxSagaFilesFromModelsConfig();
  }
};
