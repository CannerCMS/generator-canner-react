'use strict';
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

    this.option('umd', {
      required: false,
      defaults: false,
      desc: 'Building umd scripts.'
    });
  }

  writing() {
    const pkg = this.fs.readJSON(this.destinationPath(this.options.generateInto, 'package.json'), {});

    extend(pkg, {
      devDependencies: {
        "babel-cli": "^6.14.0",
        "babel-core": "^6.14.0",
        "babel-eslint": "^8.2.2",
        "babel-loader": "^7.1.3",
        "babel-preset-env": "^1.6.1",
        "babel-preset-flow": "^6.23.0",
        "babel-preset-react": "^6.24.1",
        "babel-preset-stage-0": "^6.24.1",
        "babel-runtime": "^6.11.6",
        "cross-env": "^5.1.3"
      },
      scripts: {
        "clean": "rimraf lib dist",
        "build:es5": "./node_modules/.bin/babel src --out-dir lib",
        "build": "npm run build:es5 && npm run build:flow",
        "prepublish": "npm run clean && npm run check:src && npm run build"
      }
    });

    if (this.options.umd) {
      extend(pkg.scripts, {
        "build:umd": "cross-env BABEL_ENV=commonjs NODE_ENV=development webpack ./src/index.js dist/" + this.options.name + ".js",
        "build:umd:min": "cross-env BABEL_ENV=commonjs NODE_ENV=production webpack ./src/index.js dist/" + this.options.name + ".min.js",
        "build": "npm run build:es5 && npm run build:umd && npm run build:umd:min"
      });
    }

    this.fs.writeJSON(this.destinationPath(this.options.generateInto, 'package.json'), pkg);

    // copy babelrc
    this.fs.copy(
      this.templatePath('babelrc'),
      this.destinationPath(this.options.generateInto, '.babelrc')
    );
  }
}
