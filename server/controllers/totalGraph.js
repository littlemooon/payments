'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/graph/total/incoming', dataIncoming));
  app.use(route.get('/api/graph/total/outgoing', dataOutgoing));
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
  var entries = yield mongo.entries.find({"deletedTime": {"$exists": false}}).toArray();
  if (type == 'Incoming') {
    entries = _.map(entries, function(entry) {
      entry.amount = entry.amount *-1;
      return entry;
    });
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
  // Group amounts for each category
  var amountsByCategory = {};
  _.each(entries, function(entry, i) {
    var amount = parseInt(entry.amount);

    var index = _.findIndex(categories, function(category){
      return category._id.toString() == entry.categoryId;
    });

    var current = amountsByCategory[index] ? amountsByCategory[index] : 0;
    amountsByCategory[index] = current + amount;
  });

  // Put totals in a 'y' var with category as 'key'
  var data = _.map(categories, function(category, i) {
    return{
      "key": category.description,
      "y": amountsByCategory[i] ? amountsByCategory[i] : 0
    }
  });
  // console.log('total = ');
  // console.log(data);

  return data;
}