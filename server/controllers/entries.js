'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/entries', listEntries));
  app.use(route.post('/api/entries', createEntry));
  app.use(route.put('/api/entries/:id', updateEntry));
  app.use(route.del('/api/entries/:id', deleteEntry));
};

// ROUTE FUNCTIONS

function *listEntries() {
  // get active entries by date
  var entries = yield mongo.entries.find({"deletedTime": {"$exists": false}}).sort({date: 0}).toArray();
  entries.forEach(function (entry) {
    entry.id = entry._id;
    delete entry._id;
  });

  // return
  this.body = entries;
}

function *createEntry() {
  // get new entry
  var entry = yield parse(this);
  entry.createdTime = new Date();

  // create record
  var results = yield mongo.entries.insert(entry);

  // return
  this.status = 201;
  this.body = results[0]._id.toString();
}

function *updateEntry(id) {
  // get entry to update
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

  // update record
  yield mongo.entries.update({_id:id}, entry);

  // return
  this.status = 201;
}

function *deleteEntry(id) {
  // set entry to inactive
  id = ObjectID(id);
  yield mongo.entries.update({_id:id}, {$set: {deletedTime: new Date()}});

  // return
  this.status = 201;
}