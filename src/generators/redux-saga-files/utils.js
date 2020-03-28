const path = require('path');
const {
  buildTemplateFilePath,
  buildTargetFilePath
} = require('./template-builder')

const addFile = (templateName, data) => {
  return {
      path: buildTargetFilePath(templateName, data),
      templateFile: path.join(__dirname, "templates", templateName + '.hbs'),
      type: "add",
      skipIfExists: true,
      data
  }
}

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
    appendFileWithText,
    modifyFileWithText,
    appendFileWithTemplate
}