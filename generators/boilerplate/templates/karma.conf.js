var path = require('path');

module.exports = function(config) {
  config.set({
    autoWatch: true,
    browsers: ['Chrome'],
    // singleRun: true,
    frameworks: ['mocha'],
    files: [
      'tests.webpack.js'
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    webpack: {
      externals: {
        'react/lib/ReactContext': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true
      },
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {test: /\.js$/, loaders: ['babel'], exclude: /node_modules/}
        ]
      },
      resolve: {
        alias: {
          dispatchRouter: path.join(__dirname, './src/')
        }
      }
    },
    webpackServer: {
      noInfo: true
    }
  });
};
