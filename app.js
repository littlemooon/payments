/*jslint node: true */
'use strict';

/**
 * Entry point for app. Initiates database connection and starts listening for requests on configured port.
 */

var config = require('./server/config/config'),
    mongo = require('./server/config/mongo'),
    mongoSeed = require('./server/config/mongo-seed'),
    koaConfig = require('./server/config/koa'),
    co = require('co'),
    koa = require('koa'),
    app = koa();

module.exports = app;

app.init = co(function *() {
  // mongo
  yield mongo.connect();
  yield mongoSeed();

  // koa
  koaConfig(app);

  // http server
  app.server = app.listen(config.app.port);
});

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
  app.init();
}