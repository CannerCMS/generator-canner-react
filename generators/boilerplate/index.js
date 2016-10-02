'use strict';
var _ = require('lodash');
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

    this.option('name', {
      required: true,
      desc: 'The new module name.'
    });
  },

  writing: {
    initializing: function() {
      this.fs.copy(
        this.templatePath('index.js'),
        this.destinationPath(this.options.generateInto, 'src/index.js')
      );

      this.fs.copy(
        this.templatePath('eslintrc'),
        this.destinationPath(this.options.generateInto, 'test/.eslintrc')
      );

      this.fs.copyTpl(
        this.templatePath('karma.conf.js'),
        this.destinationPath(this.options.generateInto, 'karma.conf.js'),
        {
          pkgSafeName: _.camelCase(this.options.name)
        }
      );

      this.fs.copy(
        this.templatePath('tests.webpack.js'),
        this.destinationPath(this.options.generateInto, 'tests.webpack.js')
      );

      this.fs.copyTpl(
        this.templatePath('test.js'),
        this.destinationPath(this.options.generateInto, 'test/' + this.options.name + '-test.js'), {
          pkgName: this.options.name,
          pkgSafeName: _.camelCase(this.options.name)
        }
      );
    },

    package: function() {
      var pkg = this.fs.readJSON(this.destinationPath(this.options.generateInto, 'package.json'), {});

      extend(pkg, {
        peerDependencies: {
          "react": "^15.3.1",
          "react-dom": "^15.3.1"
        },
        devDependencies: {
          "rimraf": "^2.5.4",
          "karma": "^1.2.0",
          "karma-chrome-launcher": "^2.0.0",
          "karma-cli": "^1.0.1",
          "karma-mocha": "^1.1.1",
          "karma-sourcemap-loader": "^0.3.7",
          "karma-webpack": "^1.8.0",
          "chai": "^3.5.0",
          "react-addons-test-utils": "^15.3.1",
          "webpack": "^1.13.2",
          "babel-loader": "^6.2.3",
          "mocha": "^2.4.5",
          "react": "^15.3.1",
          "react-dom": "^15.3.1"
        },
        scripts: {
          "clean": "rimraf lib dist",
          "check:src": "npm run lint && npm run test",
          "test": "cross-env BABEL_ENV=test karma start --single-run",
          "test:watch": "cross-env BABEL_ENV=test karma start"
        }
      });

      this.fs.writeJSON(this.destinationPath(this.options.generateInto, 'package.json'), pkg);
    }
  }
});
