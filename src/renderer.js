
const { upperCaseFirst } = require("upper-case-first");
const isEmpty = require('lodash.isempty');
const { getArgs, getConfig, setArgs, getCLIPath } = require('./share-objects');

const renderEntityPropTypes = (entityName) => {
    if (getArgs()['models']) {
        
        const attributes = getArgs().entityAttributes
        
        if (isEmpty(attributes)) {
            return "id: PropTypes.number"
        }
        return attributes.map(attributeKey => `${attributeKey}: PropTypes.${getArgs().activeEntity[attributeKey]}`).join(',\n');
    } else {
        return "id: PropTypes.number"
    }
};

module.exports = {
    renderEntityPropTypes
}