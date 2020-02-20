const prompts = require("./prompts");
const setActionTypes = require("./action-types");

const {
  GENERATE_FROM_CONFIG_FILE,
  GENERATE_FROM_USER_INPUTS_ACTION_TYPE,
  GENERATE_FROM_CONFIG_FILE_ACTION_TYPE
} = require("./constants");

module.exports = plop => {
  setActionTypes(plop);

  plop.setGenerator("model-infos", {
    description: "Load model infos",
    prompts,
    actions: answers => {
      const { generateCRUDOption } = answers;
      let actions = [
      ];
      
      if (generateCRUDOption === GENERATE_FROM_CONFIG_FILE) {
        actions.push({
          type: GENERATE_FROM_CONFIG_FILE_ACTION_TYPE
        });
      } else {
        actions.push({
          type: GENERATE_FROM_USER_INPUTS_ACTION_TYPE
        });
      }
      actions = [
        {
          type: 'load-default-config',
        },
        {
          type: 'get-project-template-filenames',
        },
        ...actions,
        {
          type: 'loadInitReduxSagaFiles'
        }, {
          type: 'installRequiredLibs'
        }
      ]
      return actions;
    }
  });
};
