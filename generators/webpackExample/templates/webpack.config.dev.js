var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './docs/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/docs/static/'
  },
  resolve: {
    extensions: ['.js']
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  performance: {
    hints: false
  },
  module: {
    roles: [
      {
        test: /\.js$/,
        use: 'babel',
        exclude: path.resolve(__dirname, "node_modules")
      }
    ]
  }
};
