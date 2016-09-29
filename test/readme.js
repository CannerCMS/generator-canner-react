'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('canner-react:readme', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/readme'))
      .withOptions({
        name: 'my-project',
        description: 'a cool project',
        githubAccount: 'canner',
        authorName: 'canner',
        authorUrl: 'http://canner.io',
        coveralls: true
      })
      .on('ready', function(gen) {
        gen.fs.writeJSON(gen.destinationPath('package.json'), {
          license: 'MIT'
        });
      })
      .toPromise();
  });

  it('creates and fill contents in README.md', function() {
    assert.file('README.md');
    assert.fileContent('README.md', 'var myProject = require(\'my-project\');');
    assert.fileContent('README.md', '> a cool project');
    assert.fileContent('README.md', '$ npm install --save my-project');
    assert.fileContent('README.md', 'MIT © [canner](http://canner.io)');
    assert.fileContent('README.md', '[travis-image]: https://travis-ci.org/canner/my-project.svg?branch=master');
    assert.fileContent('README.md', 'coveralls');
  });
});

describe('canner-react:readme --content', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/readme'))
      .withOptions({
        name: 'my-project',
        description: 'a cool project',
        githubAccount: 'canner',
        authorName: 'canner',
        authorUrl: 'http://canner.io',
        coveralls: true,
        content: 'My custom content'
      })
      .on('ready', function(gen) {
        gen.fs.writeJSON(gen.destinationPath('package.json'), {
          license: 'MIT'
        });
      })
      .toPromise();
  });

  it('fill custom contents in README.md', function() {
    assert.file('README.md');
    assert.fileContent('README.md', 'My custom content');
    assert.fileContent('README.md', 'MIT © [canner](http://canner.io)');
    assert.fileContent('README.md', '[travis-image]: https://travis-ci.org/canner/my-project.svg?branch=master');
    assert.fileContent('README.md', 'coveralls');
  });
});

describe('canner-react:readme --no-coveralls', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/readme'))
      .withOptions({
        name: 'my-project',
        description: 'a cool project',
        githubAccount: 'canner',
        authorName: 'canner',
        authorUrl: 'http://canner.io',
        coveralls: false
      })
      .on('ready', function(gen) {
        gen.fs.writeJSON(gen.destinationPath('package.json'), {
          license: 'MIT'
        });
      })
      .toPromise();
  });

  it('does not include coveralls badge README.md', function() {
    assert.noFileContent('README.md', 'coveralls');
  });
});

describe('canner-react:readme --generate-into', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/readme'))
      .withOptions({
        name: 'my-project',
        description: 'a cool project',
        githubAccount: 'canner',
        authorName: 'canner',
        authorUrl: 'http://canner.io',
        coveralls: true,
        generateInto: 'other/'
      })
      .on('ready', function(gen) {
        gen.fs.writeJSON(gen.destinationPath('other/package.json'), {
          license: 'MIT'
        });
      })
      .toPromise();
  });

  it('creates and fill contents in README.md', function() {
    assert.file('other/README.md');
    assert.fileContent('other/README.md', 'var myProject = require(\'my-project\');');
    assert.fileContent('other/README.md', '> a cool project');
    assert.fileContent('other/README.md', '$ npm install --save my-project');
    assert.fileContent('other/README.md', 'MIT © [canner](http://canner.io)');
    assert.fileContent('other/README.md', '[travis-image]: https://travis-ci.org/canner/my-project.svg?branch=master');
    assert.fileContent('other/README.md', 'coveralls');
  });
});

describe('canner-react:readme --content and --generate-into', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/readme'))
      .withOptions({
        name: 'my-project',
        description: 'a cool project',
        githubAccount: 'canner',
        authorName: 'canner',
        authorUrl: 'http://canner.io',
        coveralls: true,
        content: 'My custom content',
        generateInto: 'other/'
      })
      .on('ready', function(gen) {
        gen.fs.writeJSON(gen.destinationPath('other/package.json'), {
          license: 'MIT'
        });
      })
      .toPromise();
  });

  it('fill custom contents in README.md', function() {
    assert.file('other/README.md');
    assert.fileContent('other/README.md', 'My custom content');
    assert.fileContent('other/README.md', 'MIT © [canner](http://canner.io)');
    assert.fileContent('other/README.md', '[travis-image]: https://travis-ci.org/canner/my-project.svg?branch=master');
    assert.fileContent('other/README.md', 'coveralls');
  });
});

describe('canner-react:readme --no-coveralls and --generate-into', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/readme'))
      .withOptions({
        name: 'my-project',
        description: 'a cool project',
        githubAccount: 'canner',
        authorName: 'canner',
        authorUrl: 'http://canner.io',
        coveralls: false,
        generateInto: 'other/'
      })
      .on('ready', function(gen) {
        gen.fs.writeJSON(gen.destinationPath('other/package.json'), {
          license: 'MIT'
        });
      })
      .toPromise();
  });

  it('does not include coveralls badge README.md', function() {
    assert.noFileContent('other/README.md', 'coveralls');
  });
});
