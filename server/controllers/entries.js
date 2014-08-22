'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    entriesService = require('../services/entries-service');

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
  var entries = yield entriesService.getEntries();

  // return
  this.body = entries;
}

function *createEntry() {
  // get new entry
  var entry = yield parse(this);
  entry.createdTime = new Date();

  // create record
  var results = yield entriesService.createEntry(entry);

  // return
  this.status = 201;
  this.body = results[0]._id.toString();
}

function *updateEntry(id) {
  // get entry to update
  var entry = yield parse(this);
  entry = {
    updatedTime: new Date(), 
    bank: entry.bank, 
    date: entry.date,
    amount: parseFloat(entry.amount), 
    description: entry.description, 
    categoryId: entry.categoryId
  };

  // update record
  yield entriesService.updateEntry(id, entry);

  // return
  this.status = 201;
}

function *deleteEntry(id) {
  // set entry to inactive
  yield entriesService.deleteEntry(id);

  // return
  this.status = 201;
}