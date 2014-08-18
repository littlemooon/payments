'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/entries', listEntries));
  app.use(route.post('/api/entries', createEntry));
  app.use(route.put('/api/entries/:id', updateEntry));
  app.use(route.del('/api/entries/:id', deleteEntry));
};

function *listEntries() {
  var entries = yield mongo.entries.find({"deletedTime": {"$exists": false}}).sort({date: 0}).toArray();

  entries.forEach(function (entry) {
    entry.id = entry._id;
    delete entry._id;
  });

  this.body = entries;
}

function *createEntry() {
  var entry = yield parse(this);

  entry.createdTime = new Date();
  var results = yield mongo.entries.insert(entry);

  this.status = 201;
  this.body = results[0]._id.toString();

  entry.id = entry._id;
  delete entry._id;
}

function *updateEntry(id) {
  var entry = yield parse(this);
  id = ObjectID(id);

  entry = {
    _id: id,
    updatedTime: new Date(), 
    bank: entry.bank, 
    date: entry.date,
    amount: parseFloat(entry.amount), 
    description: entry.description, 
    categoryId: entry.categoryId
  };

  yield mongo.entries.update({_id:id}, entry);

  this.status = 201;
}

function *deleteEntry(id) {
  id = ObjectID(id);

  yield mongo.entries.update({_id:id}, {$set: {deletedTime: new Date()}});

  this.status = 201;
}