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
    assert.fileContent('package.json', '"babel-eslint": "^6.1.2"');
    assert.fileContent('package.json', '"babel-loader": "^6.2.5"');
    assert.fileContent('package.json', '"babel-preset-airbnb": "^2.0.0"');
    assert.fileContent('package.json', '"cross-env": "^2.0.1"');
    assert.fileContent('package.json', '"babel-plugin-transform-class-properties": "^6.16.0"');
    assert.fileContent('package.json', '"babel-plugin-transform-react-remove-prop-types": "^0.2.2"');
    assert.fileContent('package.json', '"babel-plugin-add-module-exports": "^0.2.1"');

    assert.fileContent('package.json', '"clean": "rimraf lib dist"');
    assert.fileContent('package.json', '"build:commonjs": "cross-env BABEL_ENV=commonjs babel src --out-dir lib"');
    assert.fileContent('package.json', '"build": "npm run build:commonjs"');
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
    assert.fileContent('package.json', '"babel-eslint": "^6.1.2"');
    assert.fileContent('package.json', '"babel-loader": "^6.2.5"');
    assert.fileContent('package.json', '"babel-preset-airbnb": "^2.0.0"');
    assert.fileContent('package.json', '"cross-env": "^2.0.1"');
    assert.fileContent('package.json', '"babel-plugin-transform-class-properties": "^6.16.0"');
    assert.fileContent('package.json', '"babel-plugin-transform-react-remove-prop-types": "^0.2.2"');

    assert.fileContent('package.json', '"build:umd": "cross-env BABEL_ENV=commonjs NODE_ENV=development webpack ./src/index.js dist/canner-react.js"');
    assert.fileContent('package.json', '"build:umd:min": "cross-env BABEL_ENV=commonjs NODE_ENV=production webpack ./src/index.js dist/canner-react.min.js"');
    assert.fileContent('package.json', '"clean": "rimraf lib dist"');
    assert.fileContent('package.json', '"build:commonjs": "cross-env BABEL_ENV=commonjs babel src --out-dir lib"');
    assert.fileContent('package.json', '"build": "npm run build:commonjs && npm run build:umd && npm run build:umd:min"');
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
