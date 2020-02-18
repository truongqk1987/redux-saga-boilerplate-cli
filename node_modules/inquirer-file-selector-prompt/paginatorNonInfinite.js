'use strict';

var _ = require('lodash');
var chalk = require('chalk');

/**
 * The paginator keeps track of a pointer index in a list and returns
 * a subset of the choices if the list is too long.
 */

class Paginator {
	constructor(screen) {
		this.pointer = 0;
		this.oldActive = 0;
		this.lastIndex = 0;
		this.screen = screen;
	}

	paginate(output, active, pageSize) {
		pageSize = pageSize || 7;
		var lines = output.split('\n');
    
		this.pointer += active - this.oldActive;
		this.oldActive=active;

    

		if (this.screen) {
			lines = this.screen.breakLines(lines);
			lines = _.flatten(lines);
		}
    

		// Make sure there's enough lines to paginate
		if (lines.length <= pageSize) {
			return output;
		}

		this.pointer=Math.max(0, Math.min(pageSize-2, this.pointer));


		var firstIndex = active - this.pointer;
		this.lastIndex = Math.min(lines.length, firstIndex + pageSize);

		// Duplicate the lines so it give an infinite list look
		var infinite = _.flatten([lines]);    

		var section = infinite.splice(firstIndex, pageSize).join('\n');
		section += '\n' + chalk.dim('========================================================================================'); 
		return section + '\n' + chalk.dim('(Press up and down to navigate, space to enter directory, esc to go to parent directory)');
	}
}

module.exports = Paginator;
