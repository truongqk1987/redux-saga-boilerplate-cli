
const { upperCaseFirst } = require("upper-case-first");
const { lowerCaseFirst } = require("lower-case-first");
const isEmpty = require('lodash.isempty');

const { getArgValue, getConfig } = require('./global-store');
const {
DEFAULT_BASE_API
} = require('./constants');

const ContentBuilder = (entityName, content) => {
    let _content = content;
    let _entityName = entityName;
    return {
        buildName() {
            _content = replaceNamePlaceHolder(_content, _entityName);
            return this;
        },
        buildURL() {
            _content = replaceURLPlaceholder(_content);
            return this;
        },
        buildEntityCompPropTypes() {
            _content = replaceEntityPropTypesPlaceholder(_content, _entityName)
            return this;
        },
        finish() { return _content } 
    }
}

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

const replaceNamePlaceHolder = (content, entityName) => {
    return content
        .replace(/'<nameOf>'/g, lowerCaseFirst(entityName))
        .replace(/'<NameOf>'/g, upperCaseFirst(entityName))
        .replace(/'<nameof>'/g, entityName.toLowerCase())
        .replace(/'<NAMEOF>'/g, entityName.toUpperCase());
}

const replaceURLPlaceholder = (content) => {
    const { BASE_API } = getConfig();
    return content.replace(/'<BaseAPI>'/g, BASE_API || DEFAULT_BASE_API);
}

const replaceEntityPropTypesPlaceholder = (content, entityName) => {
    return content.replace(/'<prop-types-placeholder>'/, renderEntityPropTypes(entityName))
}

module.exports = {
    ContentBuilder
}