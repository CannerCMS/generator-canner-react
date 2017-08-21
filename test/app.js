'use strict';
var _ = require('lodash');
var mockery = require('mockery');
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var Promise = require('pinkie-promise');

describe('canner-react:app', function() {
  before(function() {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    mockery.registerMock('npm-name', function() {
      return Promise.resolve(true);
    });

    mockery.registerMock('github-username', function() {
      return Promise.resolve(true);
    });

    mockery.registerMock(
      require.resolve('generator-license/app'),
      helpers.createDummyGenerator()
    );
  });

  after(function() {
    mockery.disable();
  });

  describe('running on new project', function() {
    before(function() {
      this.answers = {
        name: 'generator-canner-react',
        description: 'A canner-react generator',
        homepage: 'https://canner.io',
        githubAccount: 'canner',
        authorName: 'The Canner Team',
        authorEmail: 'hi@canner.io',
        authorUrl: 'https://canner.io',
        keywords: ['foo', 'bar']
      };
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts(this.answers)
        .toPromise();
    });

    it('creates files', function() {
      assert.file([
        '.editorconfig',
        '.gitignore',
        '.babelrc',
        '.eslintrc.js',
        '.gitattributes',
        'README.md',
        'src/index.js',
        '__test__/generator-canner-react.test.js'
      ]);
    });

    it('creates package.json', function() {
      assert.file('package.json');
      assert.jsonFileContent('package.json', {
        name: 'generator-canner-react',
        version: '0.0.0',
        description: this.answers.description,
        homepage: this.answers.homepage,
        repository: 'canner/generator-canner-react',
        author: {
          name: this.answers.authorName,
          email: this.answers.authorEmail,
          url: this.answers.authorUrl
        },
        files: ['lib'],
        keywords: this.answers.keywords,
        main: 'lib/index.js'
      });
    });

    it('creates and fill contents in README.md', function() {
      assert.file('README.md');
      assert.fileContent('README.md', 'var generatorCannerReact = require(\'generator-canner-react\');');
      assert.fileContent('README.md', '> A canner-react generator');
      assert.fileContent('README.md', '$ npm install --save generator-canner-react');
      assert.fileContent('README.md', '© [The Canner Team](https://canner.io)');
    });
  });

  describe('running on existing project', function() {
    before(function() {
      this.pkg = {
        version: '1.0.34',
        description: 'lots of fun',
        homepage: 'https://canner.io',
        repository: 'canner/generator-canner-react',
        author: 'The Canner Team',
        files: ['lib'],
        keywords: ['bar']
      };
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          name: 'generator-canner-react'
        })
        .on('ready', function(gen) {
          gen.fs.writeJSON(gen.destinationPath('package.json'), this.pkg);
          gen.fs.write(gen.destinationPath('README.md'), 'foo');
        }.bind(this))
        .toPromise();
    });

    it('extends package.json keys with missing ones', function() {
      var pkg = _.extend({name: 'generator-canner-react'}, this.pkg);
      assert.jsonFileContent('package.json', pkg);
    });

    it('does not overwrite previous README.md', function() {
      assert.fileContent('README.md', 'foo');
    });
  });

  describe('--with-travis', function() {
    before(function() {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions({travis: true})
        .toPromise();
    });

    it('have .travis.yml', function() {
      assert.file('.travis.yml');
      assert.fileContent('.travis.yml', "- 'export CHROME_BIN=chromium-browser'");
      assert.fileContent('.travis.yml', "- 'export DISPLAY=:99.0'");
      assert.fileContent('.travis.yml', "- 'sh -e /etc/init.d/xvfb start'");
    });
  });

  // describe('--projectRoot', function() {
  //   before(function() {
  //     return helpers.run(path.join(__dirname, '../generators/app'))
  //       .withOptions({projectRoot: 'generators'})
  //       .toPromise();
  //   });

  //   it('include the raw files', function() {
  //     assert.jsonFileContent('package.json', {
  //       files: ['generators'],
  //       main: 'generators/index.js'
  //     });
  //   });
  // });
});
