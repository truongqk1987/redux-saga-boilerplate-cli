const {getCLIPath} = require('../../global-store');
const path = require('path');

module.exports = plop => {
  plop.setHelper('jsx-bracket', (txt) => `{${txt}}`);

  plop.setGenerator("redux-saga-files-generator", {
    description: "Generate redux-saga files",
    prompts: [],
    actions: [
      {
        type: 'add',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/actions/{{camelCase entityName}}ActionCreator.js',
        templateFile: path.join(__dirname, 'templates', 'action.hbs'),
        skipIfExists: true,
      },
      {
        type: 'add',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/sagas/{{camelCase entityName}}Saga.js',
        templateFile: path.join(__dirname, 'templates', 'saga.hbs'),
        skipIfExists: true,
      },
      {
        type: 'add',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/sagas/index.js',
        templateFile: path.join(__dirname, 'templates', 'sagas-index.hbs'),
        skipIfExists: true,
      },
      {
        type: 'append',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/sagas/index.js',
        pattern: /(\/\/EXPORTED_SAGAS)/gi,
        template: "{{camelCase entityName}}: {{camelCase entityName}}Saga,",
      },
      {
        type: 'append',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/sagas/index.js',
        pattern: /(\/\/IMPORTED_SAGAS)/gi,
        template: `import {{camelCase entityName}}Saga from './{{camelCase entityName}}Saga';`,
      },
      {
        type: 'add',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/reducers/{{camelCase entityName}}Reducer.js',
        templateFile: path.join(__dirname, 'templates', 'reducer.hbs'),
        skipIfExists: true,
      },
      {
        type: 'add',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/reducers/index.js',
        templateFile: path.join(__dirname, 'templates', 'reducers-index.hbs'),
        skipIfExists: true,
      },
      {
        type: 'append',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/reducers/index.js',
        pattern: /(\/\/IMPORTED_REDUCERS)/gi,
        template: `import {{camelCase entityName}}Reducer from './{{camelCase entityName}}Reducer';`,
      },
      {
        type: 'append',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/reducers/index.js',
        pattern: /(\/\/EXPORTED_REDUCERS)/gi,
        template: "{{camelCase entityName}}: {{camelCase entityName}}Reducer,",
      },
      {
        type: 'add',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/components/{{pascalCase entityName}}.js',
        templateFile: path.join(__dirname, 'templates', 'entity-component.hbs'),
        skipIfExists: true,
      },
      {
        type: 'add',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/components/index.js',
        templateFile: path.join(__dirname, 'templates', 'components-index.hbs'),
        skipIfExists: true,
      },
      {
        type: 'append',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/components/index.js',
        pattern: /(\/\/EXPORTED_COMPONENTS)/gi,
        template: "export{ {{pascalCase entityName}} } from './{{pascalCase entityName}}';",
      },
      {
        type: 'add',
        path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/index.js',
        templateFile: path.join(__dirname, 'templates', 'container-component.hbs'),
        skipIfExists: true,
      },
      {
        type: 'append',
				path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/index.js',
				pattern: /({\/\*DEFINED_ENTITY_COMPONENT_HERE\*\/})/gi,
        template: '<{{pascalCase entityName}} />',
      },
      {
        type: 'append',
				path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/index.js',
				pattern: /(\/\/DEFINED_ENTITY_NAME_HERE)/gi,
        template: '{{pascalCase entityName}},',
      },
      {
        type: 'append',
				path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/index.js',
				pattern: /(\/\/DEFINED_ENTITY_ACTION_METHODS)/gi,
        templateFile: path.join(__dirname, 'templates', 'entity-actions-import.hbs'),
      },
      {
        type: 'append',
				path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/index.js',
				pattern: /(\/\/DEFINED_ENTITY_ACTIONS_DISPATCH_PROPS)/gi,
        templateFile: path.join(__dirname, 'templates', 'entity-actions-dispatch-props.hbs'),
      },
      {
        type: 'append',
				path: getCLIPath() + '/src/containers/{{pascalCase containerName}}/index.js',
				pattern: /(\/\/DEFINED_ENTITY_ACTIONS_PROPTYPES)/gi,
        templateFile: path.join(__dirname, 'templates', 'entity-actions-proptypes.hbs'),
      }
    ]
  });
};
