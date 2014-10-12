module.exports = function(grunt) {

    require('time-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            css: {
                src: [ "kshop/_assets/css/**/*.css"]
            },
            js: {
                src: ['kshop/_assets/js/*.min.js']
            }
        },

        uglify: {
            development: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                    preserveComments: 'all',
                    mangle: false,
                    beautify: true,
                    compress: {
                        sequences: false
                    }
                },
                files: {
                    'kshop/_assets/js/shop.modules.js': ['kshop/_assets/js/modules/*.js']
                }
            },
            production: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                    preserveComments: 'some',
                    mangle: true,
                    beautify: false,
                    compress: {
                        drop_console: true,
                        sequences: false
                    }
                },
                files: {
                    'kshop/_assets/js/shop.main.js': ['kshop/_assets/js/main/*.js']
                }
            }
        },

        concat: {
            css: {
                files: {
                    'kshop/_assets/css/tmp/modules.css': ['kshop/_assets/css/tmp/modules/**/*.css', 'kshop/_assets/css/tmp/spritesheets/*.css']
                }
            }
        },

        sass: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'kshop/_assets/scss',
                    src: '**/*.scss',
                    dest: 'kshop/_assets/css/tmp',
                    ext: '.css'
                }],

                options: {
                    bundleExec: false, // runs the sass with "bundle exec sass" using Bundler (http://bundler.io/)
                    loadPath: ['kshop/_assets/scss', 'kshop/_assets/bower_components'],
                    style: 'expanded',
                    trace: false,
                    require: ['bourbon', 'neat']
                }
            }
        },

        legacssy: {
            ie8: {
                options: {
                    legacyWidth: 1100
                },
                files: {
                    'kshop/_assets/css/tmp/ie-main.css': 'kshop/_assets/css/tmp/main.css'
                }
            }
        },

        cssmin: {
            production: {
                files: [{
                    expand: true,
                    cwd: 'kshop/_assets/css/tmp/',
                    src: '*.css',
                    dest: 'kshop/_assets/css/tmp'
                }]
            }
        },

        jshint: {
            files: ['kshop/_assets/js/modules/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        csslint: {
            base: {
                src: ['kshop/_assets/css/**/*.css']
            },
            options: {
                csslintrc: '.csslintrc'
            }
        },

        sprites: {
            checkout: {
                src: ['kshop/_assets/img/sprites/**/*.png'],
                css: 'kshop/_assets/scss/partials/_spritesheet.scss',
                map: 'kshop/_assets/img/spritesheet.png',
                output: 'scss',
                margin: 50,
                dimensions: false
            }
        },

        replace: {
            spritesheet: {
                src: ['kshop/_assets/scss/partials/_spritesheet.scss'],
                dest: 'kshop/_assets/scss/partials/_spritesheet.scss',
                replacements: [{
                    from: '../../',
                    to: '../'
                }]
            }
        },

        karma: {
            watch: {
                configFile: 'kshop/_assets/js/test/karmaconfig.js',
                singleRun: false,
                background: true
            },
            production: {
                configFile: 'kshop/_assets/js/test/karmaconfig.js',
                singleRun: true
            }
        },

        copy: {
            main: {
                cwd: 'kshop/_assets/css/',
                src: 'tmp/*.css',
                dest: 'kshop/_assets/css',
                expand: true,
                flatten: true,
                filter: 'isFile'
            }
        },

        watch: {
            css: {
                files: ['kshop/_assets/scss/**/*.scss'],
                tasks: ['sass', 'csslint', 'concat:css', 'legacssy:ie8', 'copy']
            },
            js: {
                files: ['kshop/_assets/js/modules/*.js'],
                tasks: ['jshint', 'newer:uglify:development']
            },
            karma: {
                files: ['kshop/_assets/js/kshop/**/*.js', 'kshop/_assets/js/test/**/*.js'],
                tasks: ['karma:watch:run']
            }
        }
    });

    // Load Grunt plugins
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Final production ready tasks
    grunt.registerTask('build', ['clean', 'sass', 'concat:css', 'legacssy:ie8', 'cssmin:production', 'uglify:production', 'copy', 'karma:production']);

    // development tasks
    grunt.registerTask('development', ['clean', 'sass', 'concat:css', 'legacssy:ie8', 'uglify:development', 'copy'])

    // Default: development then watch
    grunt.registerTask('default', ['development', 'karma:watch:start', 'watch']);

    // Tasks to regenerate spritesheet file and Sass
    grunt.registerTask('spritesheet', ['sprites', 'replace:spritesheet']);
};
