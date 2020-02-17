const path = require('path');

const { getCLIPath } = require('../share-objects');

module.exports = (plop) => [
        'generate-redux-saga-crud',
        'Generate redux saga crud files',
        {},
        () => {
            const generator = plop.getGenerator('generate-redux-saga-crud');
            const promptArgs = generator.runPrompts();
            generator.runActions(promptArgs);
        }
    ]