/* global module: false, process: false */
module.exports = function (grunt) {
    grunt.initConfig({

        jslint: {
            config: {
                src: ['frontsapi/config/**/*.json']
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
    grunt.loadNpmTasks('grunt-s3');
    grunt.loadNpmTasks('grunt-jslint');

    // Tasks
    grunt.registerTask('upload', ['jslint:config', 's3:config']);
};
