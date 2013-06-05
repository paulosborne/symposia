module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
        compile: {
            options: {
                name: 'symposia',
                exclude: ['jquery','underscore'],
                baseUrl: '.',
                out: 'dist/symposia.js',
                shim: {
                    'backbone': ['underscore']
                },
                paths: {
                    'backbone': 'vendor/backbone-amd/backbone-min',
                    'underscore': 'vendor/lodash/lodash',
                    'jquery': 'vendor/jquery/jquery',
                    'postal': 'vendor/postaljs/lib/postal'
                }
            }
        }
    },
    connect: {
        server: {
            options: {
                port: 8000,
                base: '.'
            }
        }
    },
    mocha: {
        all: {
            options: {
                urls: ['http://localhost:<%= connect.server.options.port %>/test/index.html']
            }
        }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['symposia/*.js', 'test/specs/*.js','*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['requirejs','connect', 'mocha']
      }
    }
  });

  grunt.registerTask('default', ['requirejs','connect','mocha']);
  grunt.registerTask('build:test',['connect','mocha']);

};
