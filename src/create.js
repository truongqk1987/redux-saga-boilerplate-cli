const fs = require('fs-extra');
const path = require('path');

const pwd = process.env.PWD; // folder where command start

async function replacePlaceHolders(filePath, name) {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const NameFirstUpper = name[0].toUpperCase() + name.slice(1);
    const NameFirstLower = name[0].toLowerCase() + name.slice(1);
    const NameAllLower = name.toLowerCase();

    const result = fileContent
        .replace(/'<nameOf>'/g, NameFirstLower)
        .replace(/'<NameOf>'/g, NameFirstUpper)
        .replace(/'<nameof>'/g, NameAllLower);

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
        path.join(__dirname, 'templates', copyFileName),
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
}