const isEmpty = require("lodash.isempty");
const get = require("lodash.get");

const { loadCLIConfig, loadModelsConfig } = require("./config");

const {
  buildTemplateFilePath,
  copyTemplate,
  buildTargetFilePath,
  buildInitFilePath,
  getTemplateInfo
} = require("./template-builder");
const { getArgValue, getConfig, setArgValue } = require("./share-objects");
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

const generateCRUDFiles = entityName => {
  const { EXTEND_REDUX_SAGA_TEMLATE_FILES = [] } = getConfig();
  const reduxSagaTemplates = [
    ...DEFAULT_REDUX_SAGA_TEMLATE_FILES,
    ...EXTEND_REDUX_SAGA_TEMLATE_FILES
  ];
  reduxSagaTemplates.forEach(templateName =>
    generateFileFromTemplate(templateName, entityName)
  );
};

const generateByInput = async () => {
  const entities = getArgValue('entities') || [];
  entities.forEach(generateCRUDFiles);
};

const generateByConfig = async () => {
  const modelsConfig = getArgValue('modelsConfig') || {};
  for (let containerName in modelsConfig) {
    setArgValue('container', containerName === "<share>" ? "" : containerName);
    for (let entityName in modelsConfig[containerName]) {
      const entityAttrs = get(modelsConfig, [containerName, entityName], {});
      setArgValue('entityAttrs', entityAttrs);
      generateCRUDFiles(entityName);
    }
  }
};

/* Load libs, make default folders, check pointer is at project folder */
const beforeCLIRunStep = async () => {
  if (isRunAtRootProject()) {
    await loadCLIConfig();
    loadRequiredLibs();
    initReduxSagaFiles();
  }
};

module.exports = {
  generateCRUD: async () => {
    await beforeCLIRunStep();
    generateByInput();
  },

  generateCRUDByConfig: async () => {
    await beforeCLIRunStep();
    await loadModelsConfig();
    generateByConfig();
  }
};
