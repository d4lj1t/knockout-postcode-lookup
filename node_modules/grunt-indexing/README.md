# grunt-indexing

> Create an index.html page with all files in a folder.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-indexing --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-indexing');
```

## The "indexing" task

### Overview
In your project's Gruntfile, add a section named `indexing` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  indexing: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.layout
Type: `String`
Default value: 

A path to the file which holds your HTML layout you want to use as wrapper for the indexed content. Just make sure to put `{{replace}}` somewhere.

### Usage Examples

#### Default Options

This example will find all *.html files, create a ul-li structure for them, then open the layout file, replace the placeholder and put the content into reference.html destination.

```js
grunt.initConfig({
  indexing: {
    options: {
      layout : 'path/to/your/layout/file.html'
    },
    src: ['path/to/some/*.html'],
    dest : 'reference.html'
  },
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
