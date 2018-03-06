var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './docs/index.js',
  output: {
    path: path.join(__dirname, 'docs/static'),
    filename: 'bundle.js',
    libraryTarget: 'var'
  },
  externals: {
    'react': "React",
    'react-dom': "ReactDOM"
  },
  resolve: {
    extensions: ['.js']
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel',
        exclude: path.resolve(__dirname, "node_modules")
      }
    ]
  }
};
