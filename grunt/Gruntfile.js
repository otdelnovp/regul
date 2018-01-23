module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            jquery: {
                src: [
                    '../assets/js/jquery/jquery.3.2.1.js',
                    '../assets/js/jquery/jquery.migrate.3.0.1.js'
                ],
                dest: '../assets/build/jquery.3.2.1.js'
            },
            template: {
                src: [
                    '../assets/js/jquery/plugins/jquery.*.js',
                    '../assets/js/main.js',
                    '../assets/js/forms.js',
                    '../assets/js/modules.js',
                    '../assets/js/plugins.js',
                    '../assets/js/calc.js',
                    '../assets/js/helpers.js',
                    '../assets/js/responsive.js'
                ],
                dest: '../assets/build/site.js'
            },
            css: {
                src: [
                    '../assets/css/fonts.css',
                    '../assets/css/icons.css',
                    '../assets/css/bootstrap.gs.css',

                    '../assets/css/jquery.uniform.css',
                    '../assets/css/jquery.selectric.css',
                    '../assets/css/jquery.perfect.scrollbar.css',

                    '../assets/css/jquery.owl.carousel.css',
                    '../assets/css/jquery.leaflet.popup.css',

                    '../assets/css/jquery.bootstrap.tooltip.css',

                    '../assets/css/forms.css',
                    '../assets/css/typography.css',
                    '../assets/css/main.css',
                    '../assets/css/sections.css'
                ],
                dest: '../assets/build/site.css'
            }
        },

        uglify: {
            jquery: {
                src: '../assets/build/jquery.3.2.1.js',
                dest: '../assets/build/jquery.3.2.1.min.js'
            },
            template: {
                src: '../assets/build/site.js',
                dest: '../assets/build/site.min.js'
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 30 versions', 'ie 9'],
                cascade: false
            },
            multiple_files: {
                expand: true,
                flatten: true,
                src: '../assets/build/*.css',
                dest: '../assets/build/'
            }
        },

        csswring: {

            options: {
                map: false
            },

            main: {
                cwd: '../assets/build/',
                dest: '../assets/build/',
                expand: true,
                ext: '.min.css',
                src: [
                    'site.css'
                ]
            },

            ie9: {
                cwd: '../assets/css/',
                dest: '../assets/build/',
                expand: true,
                ext: '.min.css',
                src: [
                    'ie9.css'
                ]
            }

        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('csswring');

    grunt.registerTask('default', ['concat:jquery', 'concat:template', 'uglify', 'concat:css', 'autoprefixer', 'csswring']);

};