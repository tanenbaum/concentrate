/* jshint node:true */

var fs = require('fs');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          console: true,
          module: true,
          document: true
        }
      }
    },
    nodeunit: {
      unit_test: ['test/unit_test/**/*.js'],
      server_test: ['test/server_test/**/*.js']
    },
    express: {
      options: {
      // Override defaults here
      },
      dev: {
        options: {
          script: 'src/app.js'
        }
      },
      prod: {
        options: {
          script: 'src/app.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'src/app.js',
          port: 3001
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('lint', 'jshint');

  grunt.registerTask('unit_test', 'nodeunit:unit_test');

  grunt.registerTask('some_config', 'Put a json config file in the current working directory, for the server', function () {
    fs.writeFileSync('someConfig.json', JSON.stringify(
    {
      "area1": {
        "config": {
          "foo": "bar"
        }
      },
      "area2": {
        "config": {
          "fizz": "buzz"
        },
        "extend": "area1"
      }
    }
    ));
  });

  grunt.registerTask('server_test', ['express:test', 'some_config', 'nodeunit:server_test', 'express:test:stop']);

  grunt.registerTask('default', ['lint', 'unit_test', 'server_test']);

};