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
        'webpack.config.dev.js',
        'webpack.config.ghPage.js',
        'docs/index.html'
      ]);

      assert.fileContent('package.json', '"webpack": "^4.0.1"');
      assert.fileContent('package.json', '"webpack-cli": "^2.0.10"');
      assert.fileContent('package.json', '"webpack-dev-server": "^3.1.0"');
      assert.fileContent('package.json', '"start": "./node_modules/.bin/webpack-dev-server --config webpack.config.dev.js --mode development"');
      assert.fileContent('package.json', '"lint": "eslint src test docs"');
      assert.fileContent('package.json', '"gh-pages:clean": "rimraf _gh-pages && ncp ./docs ./_gh-pages"');
      assert.fileContent('package.json', '"gh-pages:build": "cross-env BABEL_ENV=production ./node_modules/.bin/webpack --config webpack.config.ghPage.js"');
      assert.fileContent('package.json', '"gh-pages:publish": "git-directory-deploy --directory _gh-pages"');
      assert.fileContent('package.json', '"gh-pages": "npm run gh-pages:clean && npm run gh-pages:build && npm run gh-pages:publish"');
      assert.fileContent('docs/index.html', 'https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/umd/react.production.min.js"></script>');

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
        'other/webpack.config.dev.js',
        'other/webpack.config.ghPage.js',
        'other/docs/index.html'
      ]);

      assert.fileContent('other/package.json', '"webpack": "^4.0.1"');
      assert.fileContent('other/package.json', '"webpack-cli": "^2.0.10"');
      assert.fileContent('other/package.json', '"webpack-dev-server": "^3.1.0"');
      assert.fileContent('other/package.json', '"start": "./node_modules/.bin/webpack-dev-server --config webpack.config.dev.js --mode development"');
      assert.fileContent('other/package.json', '"lint": "eslint src test docs"');
      assert.fileContent('other/package.json', '"gh-pages:clean": "rimraf _gh-pages && ncp ./docs ./_gh-pages"');
      assert.fileContent('other/package.json', '"gh-pages:build": "cross-env BABEL_ENV=production ./node_modules/.bin/webpack --config webpack.config.ghPage.js"');
      assert.fileContent('other/package.json', '"gh-pages:publish": "git-directory-deploy --directory _gh-pages"');
      assert.fileContent('other/package.json', '"gh-pages": "npm run gh-pages:clean && npm run gh-pages:build && npm run gh-pages:publish"');
      assert.fileContent('other/docs/index.html', 'https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/umd/react.production.min.js"></script>');
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
