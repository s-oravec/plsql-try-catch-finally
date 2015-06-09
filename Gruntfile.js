'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['application/**/*.sql'],
                tasks: ['loadConfig', 'reinstall', 'test'],
                options: {
                    reload: true,
                    spawn: false
                },
            },
        },

        shell: {
            runSuperUserScript : {
                command: function (script) {
                    return '<%= sqlTool %> <%= superUserDbConnectString %> @' + script + '.sql'
                }
            },
            runTapirUserScript : {
                command: function (script) {
                    return '<%= sqlTool %> <%= peteUserDbConnectString %> @' + script + '.sql'
                }
            }
        }

    });

    require('load-grunt-tasks')(grunt);

	grunt.option('force', true);

    grunt.task.registerTask('loadConfig', 'Task that loads config into a grunt option', function() {
	    var init = require('./config/init')();
	    var config = require('./config/config');

        grunt.config.set('sqlTool', config.sqlTool);
        grunt.config.set('superUserDbConnectString', config.db.superUserDbConnectString);
        grunt.config.set('peteUserDbConnectString', config.db.peteUserDbConnectString);
    });

    grunt.registerTask('ci', ['loadConfig', 'reinstall', 'test', 'watch']);

    grunt.registerTask('test', ['loadConfig', 'shell:runTapirUserScript:test']);

    grunt.registerTask('install', ['loadConfig', 'shell:runTapirUserScript:install']);

    grunt.registerTask('uninstall', ['loadConfig', 'shell:runTapirUserScript:uninstall']);

    grunt.registerTask('reinstall', ['loadConfig', 'shell:runTapirUserScript:uninstall', 'shell:runTapirUserScript:install']);

}
