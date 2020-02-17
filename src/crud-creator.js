const get = require("lodash.get");

const {
  buildTemplateFilePath,
  copyTemplate,
  buildTargetFilePath,
  buildInitFilePath,
  getTemplateInfo
} = require("./template-builder");
const { getArgValue, setArgValue } = require("./global-store");
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

const generateMultipleCRUD = (entityName, entityAttrs, containers) => {
  Array.from(containers).forEach(container => {
    setArgValue({'container': container === "*" ? "" : container});
    setArgValue({entityAttrs});
    generateCRUDFiles(entityName);
  })
} 

const generateByInput = async () => {
  const entities = getArgValue("entityNames") || [];
  entities.forEach(generateCRUDFiles);
};

const generateByConfig = async () => {
  const modelsConfig = getArgValue("modelsConfig") || {};
  for (let entityName in modelsConfig) {
    const {attributes, containers} = get(modelsConfig, [entityName], {
      attributes: { id: "number"},
      containers: ["*"]
    });
    console.log(entityName, attributes, containers);
    generateMultipleCRUD(entityName, attributes, containers)
  }
};

/* Load libs, make default folders, check pointer is at project folder */
const beforeGenerateCRUD = async () => {
  if (await isRunAtRootProject()) {
    await loadCLIConfig();
    loadRequiredLibs();
  }
};

module.exports = {
  generateCRUDByInput: async () => {
    await beforeCLIRunStep();
    generateByInput();
  },

  generateCRUDByConfig: async () => {
    await beforeCLIRunStep();
    generateByConfig();
  }
};
