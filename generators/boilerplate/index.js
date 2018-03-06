'use strict';
const _ = require('lodash');
const extend = require('lodash').merge;
const Generators = require('yeoman-generator');

module.exports =  class extends Generators {
  constructor(args, options) {
    super(args, options);
    this.option('generateInto', {
      type: String,
      required: false,
      defaults: '',
      desc: 'Relocate the location of the generated files.'
    });

    this.option('name', {
      type: String,
      required: true,
      desc: 'The new module name.'
    });
  }

  initializing() {
    this.fs.copy(
      this.templatePath('index.js'),
      this.destinationPath(this.options.generateInto, 'src/index.js')
    );

    this.fs.copy(
      this.templatePath('eslintrc'),
      this.destinationPath(this.options.generateInto, '__test__/.eslintrc')
    );
  
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this.destinationPath(this.options.generateInto, '__test__/' + this.options.name + '.test.js'), {
        pkgName: this.options.name,
        pkgSafeName: _.camelCase(this.options.name)
      }
    );
  }

  writing() {
    const pkg = this.fs.readJSON(this.destinationPath(this.options.generateInto, 'package.json'), {});

    extend(pkg, {
      devDependencies: {
        "rimraf": "^2.5.4",
        "jest": "^22.4.2",
        "react-addons-test-utils": "^15.6.0",
        "enzyme": "^2.4.1",
        "mocha": "^3.2.0",
        "react": "^16.2.0",
        "react-dom": "^16.2.0"
      },
      peerDependencies: {
        "react": "^0.14.0 || ^15.0.0 || 16.x",
        "react-dom": "^0.14.0 || ^15.0.0 || 16.x"
      },
      scripts: {
        "clean": "rimraf lib dist",
        "check:src": "npm run lint && npm run test",
        "test": "jest",
        "test:watch": "jest --watch"
      }
    });

    this.fs.writeJSON(this.destinationPath(this.options.generateInto, 'package.json'), pkg);
  }
}
