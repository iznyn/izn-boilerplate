module.exports = function (grunt) {
  'use strict';

  var script_lib = [
    // JQuery
    './node_modules/jquery/dist/jquery.js',
    // FontAwesome
    './node_modules/@fortawesome/fontawesome-free/js/all.js',
  ];

  var style_lib = [
    // spinkit
    './node_modules/spinkit/spinkit.css',
  ];

  const sass = require('node-sass');

  const pugDest = 'docs/';
  const pugTask = ['pug'];

  //
  //Grunt config
  var gruntConfig = {
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner:
        '/*! <%= pkg.name %> - v<%= pkg.version %> - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      views: 'resources/docs/views/',
      styles: 'resources/docs/scss/',
      scripts: 'resources/docs/js/',
      assets: 'resources/',
      public: 'docs/',
      pug_cwd: 'resources/docs/pug/',
      pug_cwd_public: 'resources/docs/pug/src/',
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
        dest: '<%= meta.scripts %>_dist/ts.js',
      },
      babelify: {
        options: {
          transform: [['babelify', { presets: ['@babel/env'] }]],
        },
        src: ['<%= meta.scripts %>src/*.js'],
        dest: '<%= meta.scripts %>_dist/main.js',
      },
      general: {
        src: ['<%= meta.scripts %>src/*.js'],
        dest: '<%= meta.scripts %>_dist/main.js',
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/env'],
      },
      dist: {
        files: {
          '<%= meta.scripts %>_dist/main.js': '<%= meta.scripts %>src/main.js',
        },
      },
    },

    concat: {
      css_libs: {
        src: style_lib,
        dest: '<%= meta.styles %>_dist/libs.css',
      },
      css_general: {
        src: [
          '<%= meta.styles %>_dist/libs.css',
          '<%= meta.styles %>vendors/*.css',
          '<%= meta.styles %>_dist/styles.css',
        ],
        dest: '<%= meta.public %>css/styles.css',
      },
      npm_libs: {
        src: script_lib,
        dest: '<%= meta.scripts %>_dist/libs.js',
      },
      js_basic: {
        src: [
          '<%= meta.scripts %>vendors/*.js',
          '<%= meta.scripts %>src/scripts.js',
        ],
        dest: '<%= meta.scripts %>_dist/general.js',
      },
      js_general: {
        src: [
          '<%= meta.scripts %>_dist/libs.js',
          '<%= meta.scripts %>vendors/*.js',
          '<%= meta.scripts %>_dist/main.js',
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
      options: {
        processors: [
          require('postcss-short')(),
          require('postcss-fontpath')(),
          require('autoprefixer')({
            overrideBrowserslist: ['last 2 versions', 'ie 6-8', 'Firefox > 20'],
          }),
          require('cssnano')(),
        ],
      },
      dist: {
        src: '<%= meta.public %>css/*.css',
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
            dest: '<%= meta.styles %>_dist',
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
      style: {
        files: ['<%= meta.assets %>/**/*.sass', '<%= meta.assets %>/**/*.scss'],
        //tasks: ['sass','concat:css_libs','concat:css_general','postcss']
        tasks: ['sass', 'concat:css_libs', 'concat:css_general'],
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
      pug: {
        files: ['<%= meta.assets %>/**/*.pug'],
        tasks: pugTask,
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
          base: 'docs/',
          port: 5001,
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
    'sass',
    'concat:css_libs',
    'concat:css_general',
    'postcss',
    'pug',
    'browserify:babelify',
    'concat:npm_libs',
    'concat:js_general',
    'copy:scripts',
    'uglify',
  ];
  grunt.registerTask('build', buildSettings);
  grunt.registerTask('serve', ['connect:server', 'watch']);

  grunt.registerTask('build_dev', [
    'clean:dev',
    'sass',
    'concat:css_libs',
    'concat:css_general',
    'pug',
    'browserify:babelify',
    'concat:npm_libs',
    'concat:js_general',
    'copy:scripts',
  ]);
};
