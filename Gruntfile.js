/* global module: false, process: false */
module.exports = function (grunt) {

    grunt.initConfig({

        s3cfg: grunt.file.read(process.env.HOME + '/.s3cfg'),

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
                key: '<% return /access_key\\s*=\\s*([^\\s]*)/.exec(s3cfg)[1] %>',
                secret: '<% return /secret_key\\s*=\\s*([^\\s]*)/.exec(s3cfg)[1] %>',
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
