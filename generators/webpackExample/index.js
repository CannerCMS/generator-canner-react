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

    this.option('projectRoot', {
      type: String,
      required: true,
      desc: 'Relative path to the project code root'
    });

    this.option('authorName', {
      type: String,
      required: true,
      desc: 'Author name'
    });
  }

  initializing() {
    this.fs.copy(
      this.templatePath('index.js'),
      this.destinationPath(this.options.generateInto, 'docs/index.js')
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
      this.templatePath('webpack.config.ghPages.js'),
      this.destinationPath(this.options.generateInto, 'webpack.config.ghPages.js')
    );

    this.fs.copyTpl(
      this.templatePath('webpack.config.prod.js'),
      this.destinationPath(this.options.generateInto, 'webpack.config.prod.js'),
      {authorName: this.options.authorName}
    );

    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath(this.options.generateInto, 'docs/index.html')
    );
  }

  writing() {
    const pkg = this.fs.readJSON(this.destinationPath(this.options.generateInto, 'package.json'), {});

    extend(pkg, {
      devDependencies: {
        "babel-preset-react-hmre": "1.1.1",
        "webpack-hot-middleware": "^2.18.2",
        "webpack-dev-middleware": "^1.12.0",
        "express": "^4.14.0",
        "git-directory-deploy": "^1.5.1",
        "ncp": "^2.0.0"
      },
      scripts: {
        "start": "node devServer.js",
        "lint": "eslint src test docs",
        "gh-pages:clean": "rimraf _gh-pages && ncp ./docs ./_gh-pages",
        "gh-pages:build": "cross-env BABEL_ENV=production ./node_modules/.bin/webpack --config webpack.config.ghPage.js",
        "gh-pages:publish": "git-directory-deploy --directory _gh-pages",
        "gh-pages": "npm run gh-pages:clean && npm run gh-pages:build && npm run gh-pages:publish"
      }
    });
    this.fs.writeJSON(this.destinationPath(this.options.generateInto, 'package.json'), pkg);

    // babel
    const babelrc = this.fs.readJSON(this.destinationPath(this.options.generateInto, '.babelrc'), {});

    extend(babelrc, {
      env: {
        development: {
          presets: ["react-hmre"]
        }
      }
    });
    this.fs.writeJSON(this.destinationPath(this.options.generateInto, '.babelrc'), babelrc);
  }
}
