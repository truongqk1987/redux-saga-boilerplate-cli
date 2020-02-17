const path = require('path');

const { getGlobalPlop } = require('../global-store');

module.exports = (plop) => [
        'generate-redux-saga-crud',
        'Generate redux saga crud files',
        {},
        async () => {
            const generator = getGlobalPlop().getGenerator('redux-saga-entities-loader');
            const promptArgs = await generator.runPrompts();
            await generator.runActions(promptArgs);
        }
    ]