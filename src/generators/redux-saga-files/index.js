const path = require('path');
const copydir = require('copy-dir');

const { setArgValue, getConfig, getCLIPath } = require('../../global-store');
const { DEFAULT_PROJECT_SOURCE_PATH } = require('./constants');
const { addFile, appendFileWithTemplate, appendFileWithText } = require('./utils');

module.exports = plop => {
  plop.setHelper('jsx-bracket', (txt) => `{${txt}}`);

  plop.setActionType('loadInitReduxSagaFiles', async () => {
    try {
      const { PROJECT_SOURCE_PATH } = getConfig();
      copydir.sync(
          path.join(__dirname, 'redux-saga-initialization'),
          path.join(getCLIPath(), PROJECT_SOURCE_PATH || DEFAULT_PROJECT_SOURCE_PATH),
          { cover: false },
          error => error && console.log(error)
      );
      console.log('Project is ready to using now!');
    } catch(error) {
        if (error) console.log(error);
    }
  })

  plop.setGenerator("redux-saga-files", {
    description: "Generate redux-saga files",
    prompts: [],
    actions: (answers) => {
      const { containerName } = answers;

      setArgValue({containerName});

      let actions = [
        addFile('action'),

        addFile('saga'),
        addFile('sagas-index', 'index'),
        appendFileWithText(
          'sagas-index', 
          /(\/\/EXPORTED_SAGAS)/gi,
          "{{camelCase entityName}}: {{camelCase entityName}}Saga,",
          'index'
        ),
        appendFileWithText(
          'sagas-index', 
          /(\/\/IMPORTED_SAGAS)/gi,
          `import {{camelCase entityName}}Saga from './{{camelCase entityName}}Saga';`,
          'index'
        ),
        
        addFile('reducer'),
        addFile('reducers-index', 'index'),
        appendFileWithText(
          'reducers-index', 
          /(\/\/EXPORTED_REDUCERS)/gi,
          "{{camelCase entityName}}: {{camelCase entityName}}Reducer,",
          'index'
        ),
        appendFileWithText(
          'reducers-index', 
          /(\/\/IMPORTED_REDUCERS)/gi,
          `import {{camelCase entityName}}Reducer from './{{camelCase entityName}}Reducer';`,
          'index'
        ),
        
        addFile('entity-component'),
        addFile('entity-components-index', 'index'),
        appendFileWithText(
          'entity-components-index', 
          /(\/\/EXPORTED_COMPONENTS)/gi,
          "export{ {{pascalCase entityName}} } from './{{pascalCase entityName}}';",
          'index'
        ),

        addFile('container-component', 'index'),
        appendFileWithText(
          'container-component', 
          /({\/\*DEFINED_ENTITY_COMPONENT_HERE\*\/})/gi,
          '<{{pascalCase entityName}} />',
          'index'
        ),
        appendFileWithText(
          'container-component', 
          /(\/\/DEFINED_ENTITY_NAME_HERE)/gi,
          '{{pascalCase entityName}},',
          'index'
        ),
        appendFileWithTemplate(
          'container-component', 
          /(\/\/DEFINED_ENTITY_ACTION_METHODS)/gi,
          'entity-actions-import',
          'index'
        ),
        appendFileWithTemplate(
          'container-component', 
          /(\/\/DEFINED_ENTITY_ACTIONS_DISPATCH_PROPS)/gi,
          'entity-actions-dispatch-props',
          'index'
        ),
        appendFileWithTemplate(
          'container-component', 
          /(\/\/DEFINED_ENTITY_ACTIONS_PROPTYPES)/gi,
          'entity-actions-proptypes',
          'index'
        ), {
          type: 'loadInitReduxSagaFiles'
        }
      ]

      return actions
    }
  });
};
