/*
 * grunt-indexing
 * https://github.com/HouseofFraser/Phoenix
 *
 * Copyright (c) 2014 House of Fraser
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('indexing', 'Create an index.html page with all files in a folder.', function() {

    var options = this.options({

    });

    var layout = '{{replace}}';

    try {
      layout = grunt.file.read(options.layout);
    } catch(e) {

    }

    this.files.forEach(function(f) {

      var output = '<ul>';

      f.src.filter(function(filepath) {
        console.log(filepath, f.dest);
        if(filepath !== f.dest) {

          var filename = filepath.split('/').pop();

          output += '<li><a href="' + filename + '">' + filename + '</a></li>';  
        }  
      });

      output += '</ul>';

      output = layout.replace('{{replace}}', output);

      grunt.file.write(f.dest, output);

    });

  });

};
