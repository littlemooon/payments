'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/graph/time/incoming', dataIncoming));
  app.use(route.get('/api/graph/time/outgoing', dataOutgoing));
};

function *dataIncoming() {
  var entries = yield getEntries('Incoming');
  var categories = yield getCategories('Incoming');

  this.body = getData(entries, categories);
}

function *dataOutgoing() {
  var entries = yield getEntries('Outgoing');
  var categories = yield getCategories('Outgoing');

  this.body = getData(entries, categories);
}

function *getEntries(type) {
  var entries = [];
  if (type == 'Incoming') {
    entries = yield mongo.entries.find({
      "deletedTime": {"$exists": false},
      "amount": { "$lt": 0 }
    }).sort({date: 1}).toArray();
    entries = _.map(entries, function(entry) {
      entry.amount = entry.amount *-1;
      return entry;
    });
  } else {
    entries = yield mongo.entries.find({
      "deletedTime": {"$exists": false},
      "amount": { "$gt": 0 }
    }).sort({date: 1}).toArray();
  }
  return entries;
}

function *getCategories(type) {
  return yield mongo.categories.find({
    "deletedTime": {"$exists": false},
    "type": type
  }).toArray();
}

function getData(entries, categories) {
  // Group amounts for each category by date
  var amountsByDate = {};
  _.each(entries, function(entry) {
    var date = entry.date;
    var amount = entry.amount;

    if (!amountsByDate[date]) amountsByDate[date] = [];
    var index = _.findIndex(categories, function(category){
      return category._id.toString() == entry.categoryId;
    });

    var current = amountsByDate[date][index] || 0;
    amountsByDate[date][index] = current + amount;
  });

  // Put x,y coordinates in a 'value' array with category as 'key'
  var data = _.map(categories, function(category, i) {
    var dataForCategory = [];
    for (var date in amountsByDate) {
      var amount = amountsByDate[date][i] || 0;
      dataForCategory.push([parseInt(date), amount]);
    }
    console.log(dataForCategory);

    return{
      "key": category.description,
      "values": dataForCategory
    }
  });
  // console.log('time = ');
  // console.log(data);

  return data;
}