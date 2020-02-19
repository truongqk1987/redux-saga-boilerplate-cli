const path = require('path');
const fs = require('fs-extra');
const get = require('lodash.get');
const { getCLIPath } = require('../../global-store');

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

const genArgsListByConfig = (modelsConfig) => {
    const results = [];
    for (let entityName in modelsConfig) {
        const {attributes: attributesMap, containers} = get(modelsConfig, [entityName], {
            attributes: { id: "number"},
            containers: ["*"]
        });
        containers.forEach(container => {
                const containerName = container === "*" ? "" : container;
                results.push({entityName, attributesMap, containerName})
            }
        )
    }
    return results;
}

const isNodeLibExisted = (libName) => {
    try {
        require(path.join(getCLIPath(), "node_modules", libName));
        return true;
    } catch (e) {
        console.log(e);
    }
    return false;
};

module.exports = {
    loadModelsConfig,
    genArgsListByConfig,
    isNodeLibExisted
}