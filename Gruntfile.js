/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha');

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    requirejs: {
        compile: {
            options: {
                name: 'symposia',
                exclude: ['jquery','underscore'],
                baseUrl: '.',
                out: 'dist/symposia.js',
                paths: {
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
                hostname: '127.0.0.1',
                port: 8000,
                base: '.'
            }
        }
    },
    mocha: {
        all: {
            options: {
                urls: ['http://localhost:<%= connect.server.options.port %>/test/index.html'],
                reporter: 'Spec'
            }
        }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
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
        tasks: ['connect', 'mocha']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['requirejs','connect','mocha']);

};
