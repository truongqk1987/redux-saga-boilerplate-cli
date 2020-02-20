const {
  buildTemplateFilePath,
  buildTargetFilePath
} = require('./template-builder')

const addFile = (templateName, fileName = "{{camelCase entityName}}") => {
  return {
      path: buildTargetFilePath(fileName, templateName),
      templateFile: buildTemplateFilePath(templateName),
      type: "add",
      skipIfExists: true
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