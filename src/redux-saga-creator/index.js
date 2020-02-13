const { lowerCaseFirst } = require("lower-case-first");
const { upperCaseFirst } = require("upper-case-first");
const fileExists = require('file-exists');
const makeDir = require("mkdirp");
const fs = require("fs-extra");
const path = require("path");

const pwd = process.env.PWD || process.cwd(); // folder where command start

const baseFolder = (containerName, config) => containerName ? path.join(
  config.CONTAINER_FOLDER, containerName) : config.SOURCE_FOLDER;

async function replacePlaceHolders(filePath, entityName, config) {
  const fileContent = await fs.readFile(filePath, config.ENCODING);

  const result = fileContent
    .replace(/'<nameOf>'/g, lowerCaseFirst(entityName))
    .replace(/'<NameOf>'/g, upperCaseFirst(entityName))
    .replace(/'<nameof>'/g, entityName.toLowerCase())
    .replace(/'<NAMEOF>'/g, entityName.toUpperCase())
    .replace(/'<BaseAPI>'/g, config.BASE_API);
  await fs.writeFile(filePath, result, config.ENCODING);
}

const isLibExist = (libName) => {
  try {
    var instance = require(path.join(pwd, "node_modules", libName));
    return true;
  }
  catch (e) {
    return false;
  }
}

async function downloadRequiredLibs(config) {
  const requiredLibs = [
    'redux',
    'redux-thunk',
    'redux-saga',
    'redux-devtools-extension',
    'axios',
    ...config.REQUIRED_LIBS
  ]
  const uninstallLibs = requiredLibs.filter((libName) => !isLibExist(libName));
  const spawn = require('cross-spawn');
  spawn('yarn', ['add',
    ...uninstallLibs
  ]);
}

async function createInitFiles(overrideTemplateFolderPath, config) {
  downloadRequiredLibs(config);
  const initFiles = [
    'store',
    'rootReducer',
    'rootSaga',
    ...config.INIT_FILES,
  ]
  initFiles.forEach(async (fileName) => {
    const filePath = path.join(
      pwd,
      config.SOURCE_FOLDER, fileName + '.js'
    );
    const isFileExist = await fileExists(filePath);
    let fileCopyPath = path.join(getTemplateFolderPath(overrideTemplateFolderPath, config),
      'init', fileName + ".tpl");

    const isFileCopyExist = await fileExists(fileCopyPath);

    if (!isFileCopyExist) {
      fileCopyPath = path.join(__dirname, "templates/redux-saga/init", fileName + ".tpl");
    } 

    if (!isFileExist) {
      await fs.copy(
        fileCopyPath,
        filePath
      );
    }
  })
}

const getTemplateFolderPath = (overrideTemplateFolderPath, config) => {
  if (!overrideTemplateFolderPath) return __dirname + 'templates/redux-saga'
  return path.join(pwd, overrideTemplateFolderPath, config.REDUX_SAGA_TEMPLATE_FOLDER);
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
    pwd,
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

  if (!isFileExist) {
    await fs.copy(
      fileCopyPath,
      filePath
    );
    await replacePlaceHolders(filePath, buildFileName, config);
  }
};

module.exports = {
  createFiles: async (containerName, isInit, hasEntity, overrideTemplateFolderPath, defaultConfig, configFileName) => {
    let config = {...defaultConfig}
    if (configFileName) {
      const outsideConfigPath = path.join(pwd, configFileName);
      const isExistedOutsideConfig = await fileExists(outsideConfigPath)
      if (isExistedOutsideConfig) {
        const outsideConfig = await fs.readJson(outsideConfigPath)
        console.log(outsideConfig);
        config = { ...defaultConfig, ...outsideConfig}
      }
    }
    const folderContainerPath = path.join(pwd, baseFolder(containerName, config));
    const generateInContainerFolders = [config.ACTIONS_FOLDER, config.SAGAS_FOLDER, config.REDUCERS_FOLDER];
    const generateEntityFileType = ["action", "saga", "reducer"];

    createInitFiles(overrideTemplateFolderPath, config);
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
