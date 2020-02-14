
const { upperCaseFirst } = require("upper-case-first");
const isEmpty = require('lodash.isempty');
const { getArgs, getConfig, setArgs, getCLIPath } = require('./share-objects');

const renderEntityPropTypes = (entityName) => {
    if (getArgs()['models']) {
        const entityModelConfig = getArgs().entityModelConfig;
        const attributes = entityModelConfig[entityName].attributes;
        if (isEmpty(attributes)) {
            return "id: PropTypes.number"
        }
        return Object.keys(attributes).map(attributeKey => `${attributeKey}: PropTypes.${attributes[attributeKey]}`).join(',\n');
    } else {
        return "id: PropTypes.number"
    }
};

const renderEntityAttributes = (entityName) => {
    if (getArgs()['models']) {
        const entityModelConfig = getArgs().entityModelConfig;
        const attributes = entityModelConfig[entityName].attributes;
        if (isEmpty(attributes)) {
            return "id"
        }
        return Object.keys(attributes).join(',\n');
    } else {
        return "id"
    }
};

const renderEntityContent = (entityName) => {
    if (getArgs()['models']) {
        const entityModelConfig = getArgs().entityModelConfig;
        const attributes = entityModelConfig[entityName].attributes;
        const headerContent = () => {
            return Object.keys(attributes).map(attributeKey => `<td>${attributeKey}</td>`)
                .join();
        }
        if (isEmpty(attributes)) {
            return `<div>Hello ${upperCaseFirst(entityName)} {id}</div>`
        }
        return `<table border="1"><thead>${headerContent()}</thead>
            </table>`
    } else {
        return `<div>Hello ${upperCaseFirst(entityName)} {id}</div>`
    }
}

module.exports = {
    renderEntityPropTypes,
    renderEntityAttributes,
    renderEntityContent
}