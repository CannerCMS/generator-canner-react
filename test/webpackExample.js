'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('canner-react:webpackExample', function() {
  describe('generate basic webpack docs', function() {
    before(function() {
      return helpers.run(path.join(__dirname, '../generators/webpackExample'))
        .withOptions({
          projectRoot: 'lib',
          authorName: 'chilijung'
        })
        .toPromise();
    });

    it('creates files and configuration', function() {
      assert.file([
        'docs/index.js',
        'devServer.js',
        'webpack.config.dev.js',
        'webpack.config.prod.js',
        'docs/index.html'
      ]);

      assert.fileContent('package.json', '"babel-preset-react-hmre": "1.1.1"');
      assert.fileContent('package.json', '"webpack-hot-middleware": "^2.12.2"');
      assert.fileContent('package.json', '"express": "^4.14.0"');
      assert.fileContent('package.json', '"start": "node devServer.js"');
      assert.fileContent('package.json', '"lint": "eslint src test docs"');
      assert.fileContent('package.json', '"build:docs": "cross-env BABEL_ENV=production ./node_modules/.bin/webpack --config webpack.config.prod.js"');
      assert.fileContent('package.json', '"postpublish": "npm run build:docs"');
      assert.fileContent('webpack.config.prod.js', 'This file is created by chilijung. Built time: ');

      assert.fileContent('.babelrc', "react-hmre");
    });
  });

  // describe('--projectRoot', function() {
  //   before(function() {
  //     return helpers.run(path.join(__dirname, '../generators/webpackExample'))
  //       .withOptions({
  //         projectRoot: 'generators'
  //       })
  //       .toPromise();
  //   });

  //   it('define a custom root', function() {
  //     assert.fileContent('gulpfile.js', 'gulp.src(\'generators/**/*.js\')');
  //     assert.noFileContent('gulpfile.js', 'gulp.src(\'lib/**/*.js\')');
  //   });
  // });
});

describe('canner-react:webpackExample', function() {
  describe('generate-into option', function() {
    before(function() {
      return helpers.run(path.join(__dirname, '../generators/webpackExample'))
        .withOptions({
          projectRoot: 'lib',
          generateInto: 'other/',
          authorName: 'chilijung'
        })
        .toPromise();
    });

    it('creates files and configuration', function() {
      assert.file([
        'other/docs/index.js',
        'other/devServer.js',
        'other/webpack.config.dev.js',
        'other/docs/index.html'
      ]);

      assert.fileContent('other/package.json', '"babel-preset-react-hmre": "1.1.1"');
      assert.fileContent('other/package.json', '"webpack-hot-middleware": "^2.12.2"');
      assert.fileContent('other/package.json', '"express": "^4.14.0"');
      assert.fileContent('other/package.json', '"start": "node devServer.js"');
      assert.fileContent('other/package.json', '"lint": "eslint src test docs"');
      assert.fileContent('other/package.json', '"build:docs": "cross-env BABEL_ENV=production ./node_modules/.bin/webpack --config webpack.config.prod.js"');
      assert.fileContent('other/package.json', '"postpublish": "npm run build:docs"');
      assert.fileContent('other/webpack.config.prod.js', 'This file is created by chilijung. Built time: ');
      assert.fileContent('other/.babelrc', "react-hmre");
    });
  });

  // describe('--projectRoot and --generate-into', function() {
  //   before(function() {
  //     return helpers.run(path.join(__dirname, '../generators/gulp'))
  //       .withOptions({
  //         projectRoot: 'generators',
  //         generateInto: 'other/'
  //       })
  //       .toPromise();
  //   });

  //   it('define a custom root', function() {
  //     assert.fileContent('other/gulpfile.js', 'gulp.src(\'generators/**/*.js\')');
  //     assert.noFileContent('other/gulpfile.js', 'gulp.src(\'lib/**/*.js\')');
  //   });
  // });
});
