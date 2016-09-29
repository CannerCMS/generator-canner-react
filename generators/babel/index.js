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

    this.option('umd', {
      type: String,
      required: false,
      defaults: false,
      desc: 'Building umd scripts.'
    });
  },

  writing: {
    package: function() {
      var pkg = this.fs.readJSON(this.destinationPath(this.options.generateInto, 'package.json'), {});

      extend(pkg, {
        devDependencies: {
          "babel-cli": "^6.14.0",
          "babel-core": "^6.14.0",
          "babel-eslint": "^6.1.2",
          "babel-loader": "^6.2.5",
          "babel-preset-airbnb": "^2.0.0",
          "cross-env": "^2.0.1",
          "babel-plugin-transform-class-properties": "^6.16.0",
          "babel-plugin-transform-react-remove-prop-types": "^0.2.2"
        },
        scripts: {
          "clean": "rimraf lib dist",
          "build:commonjs": "cross-env BABEL_ENV=commonjs babel src --out-dir lib",
          "build": "npm run build:commonjs",
          "prepublish": "npm run clean && npm run check:src && npm run build"
        }
      });

      if (this.options.umd) {
        extend(pkg.scripts, {
          "build:umd": "cross-env BABEL_ENV=commonjs NODE_ENV=development webpack ./index.js dist/" + this.options.name + ".js",
          "build:umd:min": "cross-env BABEL_ENV=commonjs NODE_ENV=production webpack ./index.js dist/" + this.options.name + ".min.js",
          "build": "npm run build:commonjs && npm run build:umd && npm run build:umd:min"
        });
      }

      this.fs.writeJSON(this.destinationPath(this.options.generateInto, 'package.json'), pkg);
    },

    babel: function() {
      this.fs.copy(
        this.templatePath('babelrc'),
        this.destinationPath(this.options.generateInto, '.babelrc')
      );

      // Add dist/ to the .gitignore file
      var gitignore = this.fs.read(
        this.destinationPath(this.options.generateInto, '.gitignore'),
        {defaults: ''}
      ).split('\n').filter(Boolean);
      gitignore.push('lib');
      this.fs.write(
        this.destinationPath(this.options.generateInto, '.gitignore'),
        gitignore.join('\n') + '\n'
      );
    }
  }
});
