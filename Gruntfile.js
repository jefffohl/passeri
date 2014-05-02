module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-ngmin');

  // Default task.
  grunt.registerTask('default', ['jshint:client','build']);
  grunt.registerTask('server', ['jshint:server']);
  grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy:build']);
  grunt.registerTask('release', ['server','clean','html2js','jshint','concat','recess:min','ngmin','uglify','clean:release','copy']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src: {
      js: ['client/src/**/*.js'],
      jsTpl: ['<%= distdir %>/client/templates/**/*.js'],
      html: ['client/src/index.html'],
      tpl: {
        app: ['client/src/app/**/*.tpl.html'],
        common: ['client/src/common/**/*.tpl.html']
      },
      less: ['client/src/less/stylesheet.less'], // recess:build doesn't accept ** in its file patterns
      lessWatch: ['client/src/less/**/*.less']
    },
    clean: {
      build: ['<%= distdir %>/*'],
      release: ['<%= distdir %>/client/*.min.js']
    },
    copy: {
      build: {
        files: [
          { dest: '<%= distdir %>/client', src : '**', expand: true, cwd: 'client/src/assets/'},
          { dest: '<%= distdir %>/server', cwd: 'server/', src: 'server.js', expand: true},
          { dest: '<%= distdir %>/server', cwd: 'server/', src: 'config.js', expand: true},
          { dest: '<%= distdir %>/server/lib', cwd: 'server/lib/', src: '**', expand: true}
        ]
      },
      release: {
        files: [
          { dest: '<%= distdir %>', cwd: '', src: 'package.json', expand: true},
          { dest: '<%= distdir %>', cwd: '', src: 'Procfile', expand: true}
        ]
       }
    },
    html2js: {
        app: {
          options: {
           base: 'client/src/app'
          },
          src: ['<%= src.tpl.app %>'],
          dest: '<%= distdir %>/client/templates/app.js',
          module: 'templates.app'
        },
        common: {
          options: {
           base: 'client/src/common'
          },
          src: ['<%= src.tpl.common %>'],
          dest: '<%= distdir %>/client/templates/common.js',
          module: 'templates.common'
        }
    },
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>', '<%= src.jsTpl %>'],
        dest:'<%= distdir %>/client/<%= pkg.name %>.js'
      },
      index: {
        src: ['client/src/index.html'],
        dest: '<%= distdir %>/client/index.html',
        options: {
          process: true
        }
      },
      angular: {
        src:[ 'client/bower_components/angular/angular.js'
            ],
        dest: '<%= distdir %>/client/angular.js'
      },
      bootstrap: {
        src:['client/vendor/angular-ui/bootstrap/*.js'],
        dest: '<%= distdir %>/client/bootstrap.js'
      },
      jquery: {
        src:['client/bower_components/jquery/*.js'],
        dest: '<%= distdir %>/client/jquery.js'
      }
    },
    recess: {
      build: {
        files: {
          '<%= distdir %>/client/<%= pkg.name %>.css':
          ['<%= src.less %>'] },
        options: {
          compile: true
        }
      },
      min: {
        files: {
          '<%= distdir %>/client/<%= pkg.name %>.css': ['<%= src.less %>']
        },
        options: {
          compress: true
        }
      }
    },
    watch:{
      all: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['default','timestamp']
      },
      build: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['build','timestamp']
      },
      server: {
        files: '<config:lint.files>',
        tasks: 'server timestamp'
      }
    },
    jshint:{
      client: {
        src:[
          'Gruntfile.js',
          '<%= src.js %>',
          '<%= src.jsTpl %>'
          ],
        options:{
          curly:true,
          eqeqeq:true,
          immed:true,
          latedef:true,
          newcap:true,
          noarg:true,
          sub:true,
          boss:true,
          eqnull:true,
          globals: { }
        }
      },
      server: {
        src:[
          'Gruntfile.js',
          'server/server.js',
          'server/lib/*.js'
          ],
        options:{
          curly:true,
          eqeqeq:true,
          immed:true,
          latedef:true,
          newcap:true,
          noarg:true,
          sub:true,
          undef:true,
          boss:true,
          eqnull:true,
          globals: { require: false, __dirname: false, console: false, module: false, exports: false }
        }
      }
    },
    ngmin: {
      dist:{
        src:['<%= src.js %>' ,'<%= src.jsTpl %>'],
        dest:'<%= distdir %>/client/<%= pkg.name %>.min.js'
      },
      angular: {
        src:['<%= concat.angular.src %>'],
        dest: '<%= distdir %>/client/angular.min.js'
      },
      bootstrap: {
        src:['client/vendor/angular-ui/bootstrap/*.js'],
        dest: '<%= distdir %>/client/bootstrap.min.js'
      },
      jquery: {
        src:['client/bower_components/jquery/*.js'],
        dest: '<%= distdir %>/client/jquery.min.js'
      }
    },
    uglify: {
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= distdir %>/client/<%= pkg.name %>.min.js'],
        dest:'<%= distdir %>/client/<%= pkg.name %>.js'
      },
      angular: {
        src:['<%= distdir %>/client/angular.min.js'],
        dest: '<%= distdir %>/client/angular.js'
      },
      bootstrap: {
        src:['<%= distdir %>/client/bootstrap.min.js'],
        dest: '<%= distdir %>/client/bootstrap.js'
      },
      jquery: {
        src:['<%= distdir %>/client/jquery.min.js'],
        dest: '<%= distdir %>/client/jquery.js'
      }
    }
  });
};
