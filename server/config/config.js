'use strict';

var path = require('path'),
    _ = require('lodash');

var baseConfig = {
  app: {
    root: path.normalize(__dirname + '/../..'),
    env: process.env.NODE_ENV
  }
};

var platformConfig = {
  development: {
    app: {
      port: 3000
    }
  },

  test: {
    app: {
      port: 3001
    }
  },

  production: {
    app: {
      port: process.env.PORT || 3000,
      cacheTime: 7 * 24 * 60 * 60 * 1000 /* default caching time (7 days) for static files, calculated in milliseconds */
    }
  }
};

// override the base configuration with the platform specific values
module.exports = _.merge(baseConfig, platformConfig[baseConfig.app.env || (baseConfig.app.env = 'development')]);