const path = require('path');

const { getGlobalPlop } = require('../global-store');

module.exports = (plop) => [
        'generate-crud',
        'Generate redux-saga CRUD Entities',
        {},
        async () => {
            const generator = getGlobalPlop().getGenerator('model-infos');
            const promptArgs = await generator.runPrompts();
            await generator.runActions(promptArgs);
        }
    ]