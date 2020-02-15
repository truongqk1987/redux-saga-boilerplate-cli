
const { upperCaseFirst } = require("upper-case-first");
const isEmpty = require('lodash.isempty');
const { getArgValue } = require('./share-objects');

const renderEntityPropTypes = (entityName) => {
    if (getArgValue('models')) {
        const attrsConfig = getArgValue('entityAttrs');
        
        if (isEmpty(attrsConfig)) {
            return "id: PropTypes.number"
        }
        let propTypes = [];
        for (let attr in attrsConfig) {
            propTypes.push(`${attr}: PropTypes.${attrsConfig[attr]}`)
        }
        return propTypes.join(',');
    } else {
        return "id: PropTypes.number"
    }
};

module.exports = {
    renderEntityPropTypes
}