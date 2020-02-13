const { lowerCaseFirst } = require("lower-case-first");
const { upperCaseFirst } = require("upper-case-first");
const makeDir = require("mk-dir");
const fs = require("fs-extra");
const path = require("path");

const pwd = process.env.PWD; // folder where command start

async function replacePlaceHolders(filePath, entityName) {
  const fileContent = await fs.readFile(filePath, "utf8");

  const result = fileContent
    .replace(/'<nameOf>'/g, lowerCaseFirst(entityName))
    .replace(/'<NameOf>'/g, upperCaseFirst(entityName))
    .replace(/'<nameof>'/g, entityName.toLowerCase());

  await fs.writeFile(filePath, result, "utf8");
}

const buildPathOfFileInContainer = async (
  containerName,
  buildFileName,
  fileType
) => {
  const fileTypeMap = {
    action: {
      subFolder: "actions",
      buildFileExtension: "Action.js",
      copyFileName: "action"
    },
    saga: {
      subFolder: "sagas",
      buildFileExtension: "Saga.js",
      copyFileName: "saga"
    },
    reducer: {
      subFolder: "reducers",
      buildFileExtension: "Reducer.js",
      copyFileName: "reducer"
    }
  };

  const { subFolder, buildFileExtension, copyFileName } = fileTypeMap[fileType];
  const filePath = path.join(
    pwd,
    "src/containers/" + containerName,
    subFolder,
    buildFileName.toLowerCase() + buildFileExtension
  );
  await fs.copy(
    path.join(__dirname, "templates/redux-saga", copyFileName + ".tpl"),
    filePath
  );
  await replacePlaceHolders(filePath, buildFileName);
};

module.exports = {
  createFiles: async (containerName, isInit, hasEntity) => {
    const folderContainerPath =
      process.env.PWD + "/src/containers/" + containerName;
    const generateInContainerFolders = ["actions", "sagas", "reducers"];
    const generateEntityFileType = ["action", "saga", "reducer"];

    if (isInit) {
      this.createInitFiles();
    } else if (containerName) {
      (async () => {
        const paths = await Promise.all(
          generateInContainerFolders.map(folderName =>
            makeDir(folderContainerPath + "/" + folderName)
          )
        );
        if (hasEntity) {
          const entityName = hasEntity || containerName.toLowerCase();
          generateEntityFileType.forEach(fileType =>
            buildPathOfFileInContainer(containerName, entityName, fileType)
          );
        }
      })();
    }
  },
  createInitFiles: async () => {}
};
