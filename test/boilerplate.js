'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('canner-react:boilerplate', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/boilerplate'))
      .withOptions({name: 'my-module'})
      .toPromise();
  });

  it('creates boilerplate files', function() {
    assert.file([
      'src/index.js',
      'test/my-module-test.js',
      'karma.conf.js',
      'tests.webpack.js',
      'test/.eslintrc'
    ]);
    assert.fileContent('src/index.js', 'export default {};');
    assert.fileContent('test/my-module-test.js', 'import assert from \'assert\';');
    assert.fileContent('test/my-module-test.js', 'describe(\'PackageName\', function() {');
    assert.fileContent('karma.conf.js', "myModule: path.join(__dirname, './src/')");
  });
});

describe('canner-react:boilerplate --travis', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/boilerplate'))
      .withOptions({name: 'my-module', travis: true})
      .toPromise();
  });

  it('should add travis settings in karma.conf.js when enable travis', () => {
    assert.fileContent('karma.conf.js', 'customLaunchers: {');
    assert.fileContent('karma.conf.js', "config.browsers = ['Chrome_travis_ci'];");
  });
});

describe('canner-react:boilerplate', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/boilerplate'))
      .withOptions({name: 'my-module', generateInto: 'other/'})
      .toPromise();
  });

  it('creates boilerplate files using another path', function() {
    assert.file([
      'other/src/index.js',
      'other/test/my-module-test.js',
      'other/karma.conf.js',
      'other/tests.webpack.js',
      'other/test/.eslintrc'
    ]);
    assert.fileContent('other/src/index.js', 'export default {};');
    assert.fileContent('other/test/my-module-test.js', 'import assert from \'assert\';');
    assert.fileContent('other/test/my-module-test.js', 'describe(\'PackageName\', function() {');
  });
});
