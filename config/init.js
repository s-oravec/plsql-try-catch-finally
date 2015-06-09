'use strict';

/**
 * Module dependencies.
 */
var glob = require('glob'),
	chalk = require('chalk');

/**
 * Module init function.
 */
module.exports = function() {
    if (!process.env.TAPIR_ENV) {
        console.error(chalk.red('TAPIR_ENV is not defined! Using default development environment'));
	    process.env.TAPIR_ENV =  'development';
 	} else {
	    console.log(chalk.black.bgWhite('Loading using the "' + process.env.TAPIR_ENV + '" environment configuration'));
	}
};
