'use strict';
var Generators = require('yeoman-generator');

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

  initializing() {
    this.fs.copy(
      this.templatePath('settings.json'),
      this.destinationPath(this.options.generateInto, '.vscode/settings.json')
    );
  }
}
