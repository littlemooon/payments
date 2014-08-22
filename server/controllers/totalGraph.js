'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/graph/total/incoming', dataIncoming));
  app.use(route.get('/api/graph/total/outgoing', dataOutgoing));
};

// ROUTE FUNCTIONS

function *dataIncoming() {
  // get data for incoming entries
  var entries = yield getEntries('Incoming');
  var categories = yield getCategories('Incoming');

  // transform entries and categories
  this.body = getData(entries, categories);
}

function *dataOutgoing() {
  // get data for outgoing entries
  var entries = yield getEntries('Outgoing');
  var categories = yield getCategories('Outgoing');

  // transform entries and categories
  this.body = getData(entries, categories);
}

// FUNCTIONS

function *getEntries(type) {
  var entries = [];
  if (type == 'Outgoing') {
    // get entries with positive amount
    entries = yield mongo.entries.find({
      "deletedTime": {"$exists": false},
      "amount": { "$gt": 0 }
    }).toArray();
  } else {
    // get entries with a negative amount
    entries = yield mongo.entries.find({
      "deletedTime": {"$exists": false},
      "amount": { "$lt": 0 }
    }).toArray();

    // transform the amount
    entries = _.map(entries, function(entry) {
      entry.amount = entry.amount *-1;
      return entry;
    });
  }
  return entries;
}

function *getCategories(type) {
  // get 'Incoming' or 'Outgoing' categories
  return yield mongo.categories.find({
    "deletedTime": {"$exists": false},
    "type": type
  }).toArray();
}

function getData(entries, categories) {
  // group amounts for each category
  var amountsByCategory = {};
  var undefinedCategory = false;
  _.each(entries, function(entry, i) {
    var amount = entry.amount;

    // add to an array with category as index
    var index = _.findIndex(categories, function(category){
      return category._id.toString() == entry.categoryId;
    });
    if (index == -1) undefinedCategory = true;
    var current = amountsByCategory[index] || 0;
    amountsByCategory[index] = current + amount;
  });

  // put totals in a 'y' var with category as 'key'
  var data = _.map(categories, function(category, i) {
    return{
      "key": category.description,
      "y": amountsByCategory[i] || 0
    }
  });

  // create undefined category if any entries with invalid category
  undefinedCategory && data.push({
    "key": 'Undefined',
    "y": amountsByCategory[-1]
  });

  // console.log('total = ');
  // console.log(data);
  return data;
}