const {getCLIPath} = require('../../global-store');
const path = require('path');

module.exports = plop => {

  plop.setGenerator("redux-saga-files-generator", {
    description: "Generate redux-saga files",
    prompts: [],
    actions: [
      {
        type: 'add',
        path: getCLIPath() + '/src/containers/{{containerName}}/actions/{{entityName}}ActionCreator.js',
        templateFile: path.join(__dirname, 'templates', 'action.hbs'),
        skipIfExists: true,
      },
      {
        type: 'add',
        path: getCLIPath() + '/src/containers/{{containerName}}/sagas/{{entityName}}Saga.js',
        templateFile: path.join(__dirname, 'templates', 'saga.hbs'),
        skipIfExists: true,
      },
      {
        type: 'add',
        path: getCLIPath() + '/src/containers/{{containerName}}/reducers/{{entityName}}Reducer.js',
        templateFile: path.join(__dirname, 'templates', 'reducer.hbs'),
        skipIfExists: true,
      }
    ]
  });
};
