'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('canner-react:babel', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/babel'))
      .withOptions({})
      .toPromise();
  });

  it('fill package.json', function() {
    assert.fileContent('package.json', '"babel-cli": "^6.14.0"');
    assert.fileContent('package.json', '"babel-core": "^6.14.0"');
    assert.fileContent('package.json', '"babel-eslint": "^8.2.2"');
    assert.fileContent('package.json', '"babel-loader": "^7.1.3"');
    assert.fileContent('package.json', '"babel-preset-flow": "^6.23.0"');
    assert.fileContent('package.json', '"babel-preset-react": "^6.24.1"');
    assert.fileContent('package.json', '"babel-preset-stage-0": "^6.24.1"');

    assert.fileContent('package.json', '"clean": "rimraf lib dist"');
    assert.fileContent('package.json', '"build:es5": "./node_modules/.bin/babel src --out-dir lib"');
    assert.fileContent('package.json', '"build": "npm run build:es5 && npm run build:flow"');
    assert.fileContent('package.json', '"prepublish": "npm run clean && npm run check:src && npm run build"');
  });

  it('create .babelrc', function() {
    assert.file('.babelrc');
  });
});

describe('canner-react:babel with umd', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/babel'))
      .withOptions({umd: true, name: 'canner-react'})
      .toPromise();
  });

  it('fill package.json', function() {
    assert.fileContent('package.json', '"babel-cli": "^6.14.0"');
    assert.fileContent('package.json', '"babel-core": "^6.14.0"');
    assert.fileContent('package.json', '"babel-eslint": "^8.2.2"');
    assert.fileContent('package.json', '"babel-loader": "^7.1.3"');
    assert.fileContent('package.json', '"babel-preset-flow": "^6.23.0"');
    assert.fileContent('package.json', '"babel-preset-react": "^6.24.1"');
    assert.fileContent('package.json', '"babel-preset-stage-0": "^6.24.1"');

    assert.fileContent('package.json', '"build:umd": "cross-env BABEL_ENV=commonjs NODE_ENV=development webpack ./src/index.js dist/canner-react.js"');
    assert.fileContent('package.json', '"build:umd:min": "cross-env BABEL_ENV=commonjs NODE_ENV=production webpack ./src/index.js dist/canner-react.min.js"');
    assert.fileContent('package.json', '"clean": "rimraf lib dist"');
    assert.fileContent('package.json', '"build:es5": "./node_modules/.bin/babel src --out-dir lib"');
    assert.fileContent('package.json', '"build": "npm run build:es5 && npm run build:umd && npm run build:umd:min"');
    assert.fileContent('package.json', '"prepublish": "npm run clean && npm run check:src && npm run build"');
  });
});

describe('canner-react:babel generator to other folder', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../generators/babel'))
      .withOptions({
        generateInto: 'other/'
      })
      .toPromise();
  });

  it('create .babelrc', function() {
    assert.file('other/.babelrc');
  });
});
