const path = require('path');
const fs = require('fs-extra');
const get = require('lodash.get');

const loadModelsConfig = async (modelsConfigPath) => {
    let modelsConfig = {};
    try {
        modelsConfig = await fs.readJson(path.join(modelsConfigPath))
    } catch (error) {
        console.log(error);
    } finally {
        return modelsConfig;
    }
}

const buildCRUDGenArgsListByConfig = (modelsConfig) => {
    const results = [];
    for (let entityName in modelsConfig) {
        const {attributes, containers} = get(modelsConfig, [entityName], {
          attributes: { id: "number"},
          containers: ["*"]
        });
        containers.forEach(containerName => results.push({entityName, attributes, containerName})
        )
    }
    return results;
}

module.exports = {
    loadModelsConfig,
    buildCRUDGenArgsListByConfig
}