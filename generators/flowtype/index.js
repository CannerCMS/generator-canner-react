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
  }

  writing() {
    this.fs.copy(
      this.templatePath('flowconfig'),
      this.destinationPath(this.options.generateInto, '.flowconfig')
    );

    var pkg = this.fs.readJSON(
      this.destinationPath(this.options.generateInto, 'package.json'), {}
    );

    var devDep = {
      "flow-bin": "^0.66.0",
      "flow-copy-source": "^1.3.0"
    };

    extend(pkg, {
      'devDependencies': devDep,
      'scripts': {
        "build:flow": "flow-copy-source -v -i '**/test/**' src lib",
      }
    });

    this.fs.writeJSON(
      this.destinationPath(this.options.generateInto, 'package.json'), pkg
    );
  }
}
