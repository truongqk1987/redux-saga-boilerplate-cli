const get = require("lodash.get");

const {
  buildTemplateFilePath,
  copyTemplate,
  buildTargetFilePath,
  buildInitFilePath,
  getTemplateInfo
} = require("./template-builder");
const { getArgValue, setArgValue } = require("./share-objects");
const {
  loadRequiredLibs,
  getInitFilesConfig,
  getCRUDTemplates,
  loadCLIConfig,
  loadModelsConfig
} = require("./loader");

const { isRunAtRootProject } = require("./utils");

/* Copy template store, rootReducer, rootSaga into project folder */
async function initReduxSagaFiles() {
  const filesConfig = getInitFilesConfig();
  for (let templateFileName in filesConfig) {
    const { container: containerRelativePath, targetFileName } = filesConfig[
      templateFileName
    ];

    const copyFilePath = await buildTemplateFilePath(templateFileName);
    const targetFilePath = await buildInitFilePath(
      targetFileName || templateFileName,
      containerRelativePath
    );

    copyTemplate(copyFilePath, targetFilePath, templateFileName);
  }
}

const generateFile = async (templateName, targetFileName) => {
  const targetFilePath = await buildTargetFilePath(
    targetFileName,
    getTemplateInfo(templateName) || {}
  );

  copyTemplate(
    buildTemplateFilePath(templateName),
    targetFilePath,
    templateName,
    targetFileName
  );
};

const generateCRUDFiles = entityName => {
  getCRUDTemplates().forEach(templateName => 
    generateFile(templateName, entityName)
  );
};

const generateMultipleCRUD = (entityName, attributes, containers) => {
  Array.from(containers).forEach(container => {
    setArgValue('container', container === "*" ? "" : container);
    setArgValue('entityAttrs', attributes)
    generateCRUDFiles(entityName);
  })
} 

const generateByInput = async () => {
  const entities = getArgValue("entities") || [];
  entities.forEach(generateCRUDFiles);
};

const generateByConfig = async () => {
  const modelsConfig = getArgValue("modelsConfig") || {};
  for (let entityName in modelsConfig) {
    const {attributes, containers} = get(modelsConfig, [entityName], {
      attributes: { id: "number"},
      containers: ["*"]
    });
    generateMultipleCRUD(entityName, attributes, containers)
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
