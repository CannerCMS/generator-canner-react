'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('canner-react:webpackExample', function() {
  describe('generate basic webpack example', function() {
    before(function() {
      return helpers.run(path.join(__dirname, '../generators/webpackExample'))
        .withOptions({
          projectRoot: 'lib'
        })
        .toPromise();
    });

    it('creates files and configuration', function() {
      assert.file([
        'example/index.js',
        'devServer.js',
        'webpack.config.dev.js',
        'example/index.html'
      ]);

      assert.fileContent('package.json', '"babel-preset-react-hmre": "1.1.1"');
      assert.fileContent('package.json', '"webpack-hot-middleware": "^2.12.2"');
      assert.fileContent('package.json', '"express": "^4.14.0"');
      assert.fileContent('package.json', '"start": "node devServer.js"');
      assert.fileContent('package.json', '"lint": "eslint src test example"');
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
          generateInto: 'other/'
        })
        .toPromise();
    });

    it('creates files and configuration', function() {
      assert.file([
        'other/example/index.js',
        'other/devServer.js',
        'other/webpack.config.dev.js',
        'other/example/index.html'
      ]);

      assert.fileContent('other/package.json', '"babel-preset-react-hmre": "1.1.1"');
      assert.fileContent('other/package.json', '"webpack-hot-middleware": "^2.12.2"');
      assert.fileContent('other/package.json', '"express": "^4.14.0"');
      assert.fileContent('other/package.json', '"start": "node devServer.js"');
      assert.fileContent('other/package.json', '"lint": "eslint src test example"');
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
