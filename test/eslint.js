'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('canner-react:eslint', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/eslint'))
      .toPromise();
  });

  it('fill package.json', function() {
    assert.fileContent('package.json', '"eslint": "^3.1.1"');
    assert.fileContent('package.json', '"eslint-config-google": "^0.4.0"');
    assert.fileContent('package.json', '"eslint-plugin-react": "^6.2.0"');
    assert.fileContent('package.json', '"babel-eslint": "^6.1.2"');
    assert.fileContent('package.json', '"precommit-hook-eslint": "^3.0.0"');
    assert.fileContent('package.json', '"lint": "eslint src test"');
    assert.jsonFileContent('package.json', {
      'pre-commit': [
        "lint"
      ]
    });
  });

  describe('--generate-into', function() {
    before(function() {
      return helpers.run(path.join(__dirname, '../generators/eslint'))
        .withOptions({generateInto: 'other/'})
        .toPromise();
    });

    it('fill env .eslintrc with generate-into option', function() {
      assert.fileContent('other/package.json', '"eslint": "^3.1.1"');
      assert.fileContent('other/package.json', '"eslint-config-google": "^0.4.0"');
      assert.fileContent('other/package.json', '"eslint-plugin-react": "^6.2.0"');
      assert.fileContent('other/package.json', '"babel-eslint": "^6.1.2"');
      assert.fileContent('other/package.json', '"precommit-hook-eslint": "^3.0.0"');
      assert.fileContent('other/package.json', '"lint": "eslint src test"');
      assert.jsonFileContent('other/package.json', {
        'pre-commit': [
          "lint"
        ]
      });
    });
  });

  describe('with example', function() {
    before(function() {
      return helpers.run(path.join(__dirname, '../generators/eslint'))
        .withOptions({example: true})
        .toPromise();
    });

    it('eslintignore bundle file', function() {
      assert.file('.eslintignore');
      assert.fileContent('.eslintignore', 'docs/static');
    });
  });
});
