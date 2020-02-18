const path = require('path');
const directoryInquirer = require('inquirer-directory');
const fuzzyPathInquirer = require('inquirer-fuzzy-path');

const setGenerator = (generatorName) => {
	return require(path.join(__dirname, 'src', 'generators', generatorName))(_plop);
}


let _plop;
module.exports = function (plop) {
	_plop = plop;

	plop.setPrompt('directory', directoryInquirer);
	plop.setPrompt('fuzzy-selector', fuzzyPathInquirer);

	// Load generators
	setGenerator('model-infos');
	setGenerator('redux-saga-files');
};