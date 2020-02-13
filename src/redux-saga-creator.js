const { lowerCaseFirst } = require("lower-case-first");
const fileExists = require('file-exists');
const makeDir = require("mkdirp");
const fs = require("fs-extra");
const path = require("path");

const { loadConfig } = require("./config");
const { buildTemplateFilePath, copyTemplate, buildTargetFilePath } = require("./template-builder");
const { getCLIPath, getArgs } = require('./share-objects');
const { loadRequiredLibs, getInitReduxSagaFileNames } = require('./loader');
const {
  TARGET_FILE_IN_ROOT_FOLDER
} = require('./constants');


const baseFolder = (containerName, config) => containerName ? path.join(
  config.CONTAINER_FOLDER, containerName) : config.SOURCE_FOLDER;

async function initReduxSaga() {
  const isRequestInitReduxSaga = getArgs()['init'];
  if (isRequestInitReduxSaga){
    getInitReduxSagaFileNames().forEach(async (fileName) => {
      const templateFilePath = await buildTemplateFilePath(fileName);
      const targetFilePath = await buildTargetFilePath(fileName, TARGET_FILE_IN_ROOT_FOLDER)
      copyTemplate(
        templateFilePath,
        targetFilePath,
      );
    })
  }
}

const getTemplateFolderPath = (overrideTemplateFolderPath, config) => {
  if (!overrideTemplateFolderPath) return __dirname + 'templates/redux-saga'
  return path.join(getCLIPath(), overrideTemplateFolderPath, config.REDUX_SAGA_TEMPLATE_FOLDER);
};

const buildPathOfFileInContainer = async (
  containerName,
  buildFileName,
  fileType,
  overrideTemplateFolderPath,
  config
) => {
  const fileTypeMap = {
    action: {
      subFolder: config.ACTIONS_FOLDER,
      buildFileExtension: config.ACTION_FILE_EXSTENTION,
      copyFileName: "action"
    },
    saga: {
      subFolder: config.SAGAS_FOLDER,
      buildFileExtension: config.SAGA_FILE_EXSTENTION,
      copyFileName: "saga"
    },
    reducer: {
      subFolder: config.REDUCERS_FOLDER,
      buildFileExtension: config.REDUCER_FILE_EXSTENTION,
      copyFileName: "reducer"
    }
  };

  const { subFolder, buildFileExtension, copyFileName } = fileTypeMap[fileType];
  const filePath = path.join(
    getCLIPath(),
    baseFolder(containerName, config),
    subFolder,
    lowerCaseFirst(buildFileName) + buildFileExtension
  );
  

  let fileCopyPath = path.join(getTemplateFolderPath(overrideTemplateFolderPath, config), copyFileName + ".tpl");

  const isFileExist = await fileExists(filePath);
  const isFileCopyExist = await fileExists(fileCopyPath);

  if (!isFileCopyExist) {
    fileCopyPath = path.join(__dirname + '/templates/redux-saga', copyFileName + ".tpl");
  }

  copyTemplate(fileCopyPath, filePath);
};

module.exports = {
  createFiles: async () => {
    const args = getArgs();
    const config = await loadConfig();

    loadRequiredLibs();
    initReduxSaga();

    const containerName = args["container-name"];
    const hasEntity = args.entity;
    const overrideTemplateFolderPath = args['override-template'];
    const folderContainerPath = path.join(getCLIPath(), baseFolder(containerName, config));
    const generateInContainerFolders = [config.ACTIONS_FOLDER, config.SAGAS_FOLDER, config.REDUCERS_FOLDER];
    const generateEntityFileType = ["action", "saga", "reducer"];

    
    (async () => {
      const paths = await Promise.all(
        generateInContainerFolders.map(folderName =>
          makeDir(folderContainerPath + "/" + folderName)
        )
      );
      if (hasEntity) {
        const entityName = hasEntity || containerName.toLowerCase();
        generateEntityFileType.forEach(fileType =>
          buildPathOfFileInContainer(containerName, entityName, fileType, overrideTemplateFolderPath, config)
        );
      }
    })();
  },
};
