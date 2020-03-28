
const { upperCaseFirst } = require('upper-case-first');

const { addFile, appendFileWithTemplate, appendFileWithText, modifyFileWithText } = require('./utils');
module.exports = plop => {
  plop.setHelper('jsx-bracket', (txt) => `{${txt}}`);

  plop.setGenerator("redux-saga-files", {
    description: "Generate redux-saga files",
    prompts: [],
    actions: (transformedModelsJSON) => {
      let actions = [];
     
      for (let container in transformedModelsJSON) {
        const entities = Object.keys(transformedModelsJSON[container]);
        entities.forEach(entity => {
          const data = { entity, container, attributes: transformedModelsJSON[container][entity]};
          actions = [
            ...actions,
            addFile('action', data),

            addFile('saga', data),
            addFile('sagas-index', {...data, entities, entity: 'index'}),

            addFile('reducer', data),
            addFile('reducers-index', {...data, entities, entity: 'index'}),

            addFile('entity-component', {...data, entity: upperCaseFirst(data.entity)}),
            addFile('entity-components-index', {...data, entities, entity: 'index'}),

            addFile('container-component', {...data, entities, entity: 'index'})
            
          ]
        })
      }
      
      return actions
    }
  });
};
