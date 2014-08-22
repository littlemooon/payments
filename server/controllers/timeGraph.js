'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/graph/time/incoming', dataIncoming));
  app.use(route.get('/api/graph/time/outgoing', dataOutgoing));
};

// ROUTE FUNCTIONS

function *dataIncoming() {
  // get data for incoming entries
  var entries = yield getEntries('Incoming');
  var categories = yield getCategories('Incoming');

  // transform entries and categories
  this.body = dataTransform(entries, categories);
}

function *dataOutgoing() {
  // get data for outgoing entries
  var entries = yield getEntries('Outgoing');
  var categories = yield getCategories('Outgoing');

  // transform entries and categories
  this.body = dataTransform(entries, categories);
}

// FUNCTIONS

function *getEntries(type) {
  var entries = [];
  if (type == 'Outgoing') {
    // get entries with positive amount
    entries = yield mongo.entries.find({
      "deletedTime": {"$exists": false},
      "amount": { "$gt": 0 }
    }).sort({date: 1}).toArray();
  } else {
    // get entries with a negative amount
    entries = yield mongo.entries.find({
      "deletedTime": {"$exists": false},
      "amount": { "$lt": 0 }
    }).sort({date: 1}).toArray();

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

function dataTransform(entries, categories) {
  // group amounts for each category by date
  var amountsByDate = {};
  _.each(entries, function(entry) {
    var date = entry.date;
    var amount = entry.amount;

    // add to an array with category as index
    if (!amountsByDate[date]) amountsByDate[date] = [];
    var index = _.findIndex(categories, function(category){
      return category._id.toString() == entry.categoryId;
    });
    var current = amountsByDate[date][index] || 0;
    amountsByDate[date][index] = current + amount;
  });

  // put x,y coordinates in a 'value' array with category as 'key'
  var data = _.map(categories, function(category, i) {
    var dataForCategory = [];
    for (var date in amountsByDate) {
      var amount = amountsByDate[date][i] || 0;
      dataForCategory.push([parseInt(date), amount]);
    }

    return{
      "key": category.description,
      "values": dataForCategory
    }
  });

  // console.log('time = ');
  // console.log(data);
  return data;
}