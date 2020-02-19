const path = require("path");

const { getCLIPath } = require('../../global-store');
const {
  buildTemplateFilePath,
  buildTargetFilePath
} = require('./template-builder')

const isNodeLibExisted = (libName) => {
  try {
    require(path.join(getCLIPath(), "node_modules", libName));
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
};

const addFile = (templateName, fileName = "{{camelCase entityName}}") => (
  {
    path: buildTargetFilePath(fileName, templateName),
    templateFile: buildTemplateFilePath(templateName),
    type: "add",
    skipIfExists: true
  }
);

const appendFileWithText = (templateName, pattern, template, fileName = "{{entityName}}") => {
  return {
    type: 'append',
    path: buildTargetFilePath(fileName, templateName),
    pattern,
    template,
  }
}

const modifyFileWithText = (templateName, pattern, template, fileName = "{{entityName}}") => {
  return {
    type: 'modify',
    path: buildTargetFilePath(fileName, templateName),
    pattern,
    template,
  }
}

const appendFileWithTemplate = (templateName, pattern, templateAppendName, fileName = "{{entityName}}") => {
  return {
    type: 'append',
    path: buildTargetFilePath(fileName, templateName),
    pattern,
    templateFile: buildTemplateFilePath(templateAppendName),
  }
}


module.exports = {
    addFile,
    isNodeLibExisted,
    appendFileWithText,
    modifyFileWithText,
    appendFileWithTemplate
}