const { lowerCaseFirst } = require('lower-case-first');
const { upperCaseFirst } = require('upper-case-first');
const fs = require('fs-extra');
const path = require('path');

const pwd = process.env.PWD; // folder where command start

async function replacePlaceHolders(filePath, entityName) {
    const fileContent = await fs.readFile(filePath, 'utf8');

    const result = fileContent
        .replace(/'<nameOf>'/g, lowerCaseFirst(entityName))
        .replace(/'<NameOf>'/g, upperCaseFirst(entityName))
        .replace(/'<nameof>'/g, entityName.toLowerCase());

    await fs.writeFile(filePath, result, 'utf8');
}

const buildPathOfFileInContainer = async (containerName, buildFileName, fileType) => {
    const fileTypeMap = {
        action: {
            subFolder: 'actions',
            buildFileExtension: 'Action.js',
            copyFileName: 'action'
        },
        saga: {
            subFolder: 'sagas',
            buildFileExtension: 'Saga.js',
            copyFileName: 'saga'
        },
        reducer: {
            subFolder: 'reducers',
            buildFileExtension: 'Reducer.js',
            copyFileName: 'reducer'
        },
    }

    const { subFolder, buildFileExtension, copyFileName } = fileTypeMap[fileType];
    const filePath = path.join(
        pwd,
        'src/containers/' + containerName,
        subFolder,
        buildFileName.toLowerCase() + buildFileExtension
    );
    await fs.copy(
        path.join(__dirname, 'templates/redux-saga', copyFileName + '.tpl'),
        filePath
      );
    await replacePlaceHolders(filePath, buildFileName);
}


module.exports = {
    createFile: async (buildFileName, containerName, fileType) => {
        buildPathOfFileInContainer(
            containerName,
            buildFileName,
            fileType
        )
    },
    createInitFiles: async() => {
        
    }
}