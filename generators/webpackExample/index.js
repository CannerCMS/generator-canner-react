'use strict';
var extend = require('lodash').merge;
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    this.option('generateInto', {
      type: String,
      required: false,
      defaults: '',
      desc: 'Relocate the location of the generated files.'
    });

    this.option('projectRoot', {
      type: String,
      required: true,
      desc: 'Relative path to the project code root'
    });
  },

  writing: {
    initializing: function() {
      this.fs.copy(
        this.templatePath('index.js'),
        this.destinationPath(this.options.generateInto, 'example/index.js')
      );

      this.fs.copy(
        this.templatePath('devServer.js'),
        this.destinationPath(this.options.generateInto, 'devServer.js')
      );

      this.fs.copy(
        this.templatePath('webpack.config.dev.js'),
        this.destinationPath(this.options.generateInto, 'webpack.config.dev.js')
      );

      this.fs.copy(
        this.templatePath('index.html'),
        this.destinationPath(this.options.generateInto, 'example/index.html')
      );
    },

    package: function() {
      var pkg = this.fs.readJSON(this.destinationPath(this.options.generateInto, 'package.json'), {});

      extend(pkg, {
        devDependencies: {
          "babel-preset-react-hmre": "1.1.1",
          "webpack-hot-middleware": "^2.12.2",
          "express": "^4.14.0"
        },
        scripts: {
          start: "node devServer.js",
          lint: "eslint src test example"
        }
      });
      this.fs.writeJSON(this.destinationPath(this.options.generateInto, 'package.json'), pkg);
    },

    babel: function() {
      var babelrc = this.fs.readJSON(this.destinationPath(this.options.generateInto, '.babelrc'), {});

      babelrc.env.development.presets = ["react-hmre"];
      this.fs.writeJSON(this.destinationPath(this.options.generateInto, '.babelrc'), babelrc);
    }
  }
});
