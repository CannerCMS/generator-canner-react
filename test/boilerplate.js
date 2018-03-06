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
      '__test__/my-module.test.js',
      '__test__/.eslintrc'
    ]);
    assert.fileContent('src/index.js', 'export default {};');
    assert.fileContent('__test__/my-module.test.js', 'describe(\'PackageName\', function() {');
  });
});

describe('canner-react:boilerplate --travis', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/boilerplate'))
      .withOptions({name: 'my-module', travis: true})
      .toPromise();
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
      'other/__test__/my-module.test.js',
      'other/__test__/.eslintrc'
    ]);
    assert.fileContent('other/src/index.js', 'export default {};');
    assert.fileContent('other/__test__/my-module.test.js', 'describe(\'PackageName\', function() {');
  });
});
