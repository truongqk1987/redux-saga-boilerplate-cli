const prompts = require("./prompts");
const setActionTypes = require("./action-types");

module.exports = plop => {
  setActionTypes(plop);

  plop.setGenerator("model-infos", {
    description: "Load model infos",
    prompts,
    actions: () =>  [
        {
          type: 'generate-models-from-json'
        },
        {
          type: 'load-init-redux-saga-files'
        }, 
        {
          type: 'install-required-libs'
        }
      ]
  });
};
