const path = require('path');
const directoryInquirer = require('inquirer-directory');
const fileSelectorInquirer = require('inquirer-file-selector-prompt')
const fuzzyPathInquirer = require('inquirer-fuzzy-path');

const loadGenerator = (generatorName) => {
	return require(path.join(__dirname, 'src', 'generators', generatorName))(_plop);
}


let _plop;
module.exports = function (plop) {
	_plop = plop;

	plop.setPrompt('directory', directoryInquirer);
	plop.setPrompt('fuzzy-selector', fuzzyPathInquirer)
	// Load generators
	loadGenerator('generate-redux-saga-crud');
};