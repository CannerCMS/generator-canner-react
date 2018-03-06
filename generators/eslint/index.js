'use strict';
const Generators = require('yeoman-generator');
const extend = require('lodash').merge;

module.exports =  class extends Generators {
  constructor(args, options) {
    super(args, options);
    this.option('generateInto', {
      type: String,
      required: false,
      defaults: '',
      desc: 'Relocate the location of the generated files.'
    });

    this.option('example', {
      type: String,
      required: false,
      desc: 'with example'
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('eslintrc.js'),
      this.destinationPath(this.options.generateInto, '.eslintrc.js')
    );

    if (this.options.example) {
      this.fs.copy(
        this.templatePath('eslintignore'),
        this.destinationPath(this.options.generateInto, '.eslintignore')
      );
    }

    var pkg = this.fs.readJSON(
      this.destinationPath(this.options.generateInto, 'package.json'), {}
    );

    var devDep = {
      "eslint": "^4.18.2",
      "eslint-plugin-flowtype": "^2.46.1",
      "eslint-plugin-react": "^6.2.0",
      "babel-eslint": "^8.2.2",
      'precommit-hook-eslint': '^3.0.0'
    };

    extend(pkg, {
      'devDependencies': devDep,
      'scripts': {
        lint: "eslint src test"
      },
      'pre-commit': [
        "lint"
      ]
    });

    this.fs.writeJSON(
      this.destinationPath(this.options.generateInto, 'package.json'), pkg
    );
  }
}
