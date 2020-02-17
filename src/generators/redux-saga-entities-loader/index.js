const prompts = require("./prompts");
const setActionTypes = require("./action-types");

const {
  GENERATE_FROM_CONFIG_FILE,
  GENERATE_FROM_USER_INPUTS_ACTION_TYPE,
  GENERATE_FROM_CONFIG_FILE_ACTION_TYPE
} = require("./constants");

module.exports = plop => {
  setActionTypes(plop);

  plop.setGenerator("redux-saga-entities-loader", {
    description: "Load entities",
    prompts,
    actions: answers => {
      const { generateCRUDOption } = answers;
      let actions = [];
      
      if (generateCRUDOption === GENERATE_FROM_CONFIG_FILE) {
        actions.push({
          type: GENERATE_FROM_CONFIG_FILE_ACTION_TYPE
        });
      } else {
        actions.push({
          type: GENERATE_FROM_USER_INPUTS_ACTION_TYPE
        });
      }
      return actions;
    }
  });
};
