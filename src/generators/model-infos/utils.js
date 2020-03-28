const path = require('path');
const fs = require('fs-extra');
const get = require('lodash.get');
const { getCLIPath } = require('../../global-store');

const loadModelsJSON = async (modelsJSONPath) => {
    let modelsJSON = {};
    try {
        modelsJSON = await fs.readJson(modelsJSONPath)
    } catch (error) {
        console.log(error);
    } finally {
        return modelsJSON;
    }
}

const transformModelsJSON = (modelsJSON) => {
    const results = {};
    const flatModelsJSON = [];
    for (let entity in modelsJSON) {
        const {attributes, containers} = get(modelsJSON, [entity]);
        containers.forEach(container => {
            flatModelsJSON.push({entity, attributes, container})
        })
    }
    for (let index in flatModelsJSON) {
        const { entity, attributes, container } = flatModelsJSON[index];
        results[container] = {
            ...results[container],
            [entity]: {
                ...attributes
            }
        }
    }
    return results;
}

const isNodeLibExisted = (libName) => {
    try {
        require(path.join(getCLIPath(), "node_modules", libName));
        return true;
    } catch (e) {
    }
    return false;
};

module.exports = {
    loadModelsJSON,
    transformModelsJSON,
    isNodeLibExisted
}