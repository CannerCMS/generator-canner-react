'use strict';
var generators = require('yeoman-generator');
var extend = require('lodash').merge;

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    this.option('generateInto', {
      type: String,
      required: false,
      defaults: '',
      desc: 'Relocate the location of the generated files.'
    });
  },

  writing: function() {
    this.fs.copy(
      this.templatePath('eslintrc.js'),
      this.destinationPath(this.options.generateInto, '.eslintrc.js')
    );

    var pkg = this.fs.readJSON(
      this.destinationPath(this.options.generateInto, 'package.json'), {}
    );

    var devDep = {
      'eslint': '^3.1.1',
      'eslint-config-google': '^0.4.0',
      'eslint-plugin-react': '^6.2.0',
      'babel-eslint': '^6.1.2',
      'precommit-hook-eslint': '^3.0.0'
    };

    extend(pkg, {
      'devDependencies': devDep,
      'scripts': {
        lint: "eslint src test"
      },
      'pre-commit': [
        "lint",
        "test"
      ]
    });

    this.fs.writeJSON(
      this.destinationPath(this.options.generateInto, 'package.json'), pkg
    );
  }
});
