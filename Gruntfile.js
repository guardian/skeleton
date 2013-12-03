/* global module: false, process: false */
module.exports = function (grunt) {
    grunt.initConfig({

        jshint: {
            config: {
                src: ['frontsapi/config/**/*.json']
            }
        },

        execute: {
            validate: {
                src: ['validate.js']
            }
        },

        s3: {
            options: {
                bucket: 'aws-frontend-store',
                access: 'public-read'
            },
            config: {
                sync: [{
                    src: 'frontsapi/config/**/*.json',
                    dest: '<%= process.env.ENVIRONMENT ? process.env.ENVIRONMENT.toUpperCase() : "DEV" %>/frontsapi/config/',
                    rel : 'frontsapi/config',
                    options: {
                        verify: true
                    }
                }]
            }
        }

    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-s3');

    // Tasks
    grunt.registerTask('upload', ['jshint:config', 'execute:validate', 's3:config']);
};
