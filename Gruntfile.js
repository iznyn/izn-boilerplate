module.exports = function (grunt) {
  'use strict';

  var script_lib = [];

  var style_lib = [];

  var convertToBlade = false;

  //Get pug destination
  if (convertToBlade) {
    var pugDest = 'resources/html/dist/';
    var pugTask = ['pug', 'copy:pug_php'];
  } else {
    var pugDest = 'public/';
    var pugTask = ['pug'];
  }

  const sass = require('node-sass');

  //
  //Grunt config
  var gruntConfig = {
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner:
        '/*! <%= pkg.name %> - v<%= pkg.version %> - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      views: 'resources/views/',
      styles: 'resources/sass/',
      scripts: 'resources/js/',
      assets: 'resources/',
      components: 'resources/components/',
      public: 'public/',
      pug_cwd: 'resources/pug/',
      pug_cwd_public: 'resources/pug/public/',
      pug_files: '**/*.pug',
      pug_dest: pugDest,
      node_modules: './node_modules/',
    },

    browserify: {
      typescripts: {
        options: {
          plugin: ['tsify'],
          sourceType: 'module',
        },
        src: ['<%= meta.scripts %>ts/*.ts'],
        dest: '<%= meta.scripts %>dist/ts.js',
      },
      babelify: {
        options: {
          transform: [['babelify', { presets: ['@babel/env'] }]],
        },
        src: ['<%= meta.scripts %>src/*.js'],
        dest: '<%= meta.scripts %>dist/main.js',
      },
      general: {
        src: ['<%= meta.scripts %>src/*.js'],
        dest: '<%= meta.scripts %>dist/main.js',
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/env'],
      },
      dist: {
        files: {
          '<%= meta.scripts %>dist/main.js': '<%= meta.scripts %>src/main.js',
        },
      },
    },

    concat: {
      css_libs: {
        src: style_lib,
        dest: '<%= meta.styles %>dist/libs.css',
      },
      css_general: {
        src: [
          '<%= meta.assets %>tailwind.css',
          '<%= meta.styles %>dist/libs.css',
          '<%= meta.styles %>vendors/*.css',
          '<%= meta.styles %>dist/styles.css',
        ],
        dest: '<%= meta.styles %>dist/styles.css',
      },
      npm_libs: {
        src: script_lib,
        dest: '<%= meta.scripts %>dist/libs.js',
      },
      js_basic: {
        src: [
          '<%= meta.scripts %>vendors/*.js',
          '<%= meta.scripts %>src/scripts.js',
        ],
        dest: '<%= meta.scripts %>dist/general.js',
      },
      js_general: {
        src: [
          '<%= meta.scripts %>dist/libs.js',
          '<%= meta.scripts %>vendors/*.js',
          '<%= meta.scripts %>dist/main.js',
        ],
        dest: '<%= meta.public %>js/scripts.js',
      },
    },

    uglify: {
      general: {
        src: '<%= meta.public %>js/scripts.js',
        dest: '<%= meta.public %>js/scripts.js',
      },
    },

    postcss: {
      dev: {
        options: {
          processors: [require('tailwindcss')(), require('autoprefixer')()],
        },
        src: '<%= meta.styles %>dist/styles.css',
        dest: '<%= meta.public %>css/styles.css',
      },
      prod: {
        options: {
          processors: [require('cssnano')()],
        },
        src: '<%= meta.public %>css/styles.css',
        dest: '<%= meta.public %>css/styles.css',
      },
    },

    sass: {
      basic: {
        options: {
          implementation: sass,
          compass: true,
          sourcemap: 'none',
          style: 'expended',
        },
        files: [
          {
            expand: true,
            cwd: '<%= meta.styles %>src',
            src: ['*.sass', '*.scss'],
            dest: '<%= meta.styles %>dist',
            ext: '.css',
          },
        ],
      },
    },

    pug: {
      main: {
        options: {
          pretty: true,
          data: {
            debug: false,
          },
        },
        files: [
          {
            expand: true,
            cwd: '<%= meta.pug_cwd_public %>',
            src: ['<%= meta.pug_files %>'],
            dest: '<%= meta.pug_dest %>',
            ext: '.html',
          },
        ],
      },
    },

    copy: {
      scripts: {
        files: [
          {
            expand: true,
            cwd: '<%= meta.scripts %>single/',
            src: '**',
            dest: '<%= meta.public %>js/',
          },
        ],
      },
      pug_php: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= meta.pug_dest %>',
            src: ['**/*.html'],
            dest: '<%= meta.views %>',
            rename: function (dest, src) {
              return dest + src.replace(/\.html$/, '.blade.php');
            },
          },
        ],
      },
    },

    watch: {
      options: {
        spawn: false,
        interrupt: false,
        livereload: true,
      },
      pug: {
        files: ['<%= meta.assets %>/**/*.pug'],
        tasks: [...pugTask, 'postcss:dev'],
      },
      style: {
        files: ['<%= meta.assets %>/**/*.sass', '<%= meta.assets %>/**/*.scss'],
        tasks: ['sass', 'concat:css_libs', 'concat:css_general', 'postcss:dev'],
      },
      script: {
        files: ['<%= meta.assets %>/**/*.js'],
        //tasks: ['browserify:babelify','concat:npm_libs','concat:js_general','copy:scripts','uglify']
        tasks: [
          'browserify:babelify',
          'concat:npm_libs',
          'concat:js_general',
          'copy:scripts',
        ],
      },
    },

    clean: {
      options: {
        force: true,
      },
      dev: [
        '<%= meta.public %>css',
        '<%= meta.public %>js',
        '<%= meta.public %>*.html',
      ],
      css: ['<%= meta.public %>css'],
      js: ['<%= meta.public %>js'],
      prod: ['<%= meta.public %>*.html'],
    },

    connect: {
      server: {
        options: {
          livereload: true,
          base: 'public/',
          port: 5000,
        },
      },
    },
  };

  grunt.initConfig(gruntConfig);

  grunt.loadNpmTasks('@lodder/grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');

  //
  // Build tasking
  //
  var buildSettings = [
    'clean:dev',
    'pug',
    'sass',
    'concat:css_libs',
    'concat:css_general',
    'postcss',
    'browserify:babelify',
    'concat:npm_libs',
    'concat:js_general',
    'copy:scripts',
    'uglify',
  ];
  if (convertToBlade) {
    buildSettings.push('copy:pug_php');
  }
  grunt.registerTask('build', buildSettings);
  grunt.registerTask('serve', ['connect:server', 'watch']);

  grunt.registerTask('build_dev', [
    'clean:dev',
    'pug',
    'sass',
    'concat:css_libs',
    'concat:css_general',
    'postcss',
    'browserify:babelify',
    'concat:npm_libs',
    'concat:js_general',
    'copy:scripts',
  ]);
};
