'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/data/time', timeData));
  app.use(route.get('/api/data/pie', pieData));
  app.use(route.get('/api/data/cumulative', cumulativeData));
};

function *timeData() {
  var entries = yield mongo.entries.find({"deletedTime": {"$exists": false}}).toArray();
  var categories = yield mongo.categories.find({"deletedTime": {"$exists": false}}).toArray();

  // Group amounts for each category by date
  var amountsByDate = {};
  _.each(entries, function(entry, i) {
    var date = parseInt(entry.date);
    var amount = parseInt(entry.amount);

    if (!amountsByDate[date]) amountsByDate[date] = [];
    var index = _.findIndex(categories, function(category){
      return category._id.toString() == entry.categoryId;
    });

    var current = amountsByDate[date][index] ? amountsByDate[date][index] : 0;
    amountsByDate[date][index] = current + amount;
  });

  // Put x,y coordinates in a 'value' array with category as 'key'
  var graphData = _.map(categories, function(category, i) {
    var dataForCategory = [];
    for (var date in amountsByDate) {
      var amount = amountsByDate[date][i] ? amountsByDate[date][i] : 0;
      dataForCategory.push([parseInt(date), amount]);
    }
    return{
      "key": category.description,
      "values": dataForCategory
    }
  });
  console.log('time = ');
  console.log(graphData);

  this.body = graphData;
}

function *pieData() {
  var entries = yield mongo.entries.find({"deletedTime": {"$exists": false}}).toArray();
  var categories = yield mongo.categories.find({"deletedTime": {"$exists": false}}).toArray();

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
  var graphData = _.map(categories, function(category, i) {
    return{
      "key": category.description,
      "y": amountsByCategory[i] ? amountsByCategory[i] : 0
    }
  });
  console.log('pie = ');
  console.log(graphData);

  this.body = graphData;
}

function *cumulativeData() {
  var entries = yield mongo.entries.find({"deletedTime": {"$exists": false}}).toArray();

  // Get total amount spent by date
  var amountsByDate = {};
  _.each(entries, function(entry, i) {
    var date = parseInt(entry.date);
    var amount = parseInt(entry.amount);

    var current = amountsByDate[date] ? amountsByDate[date] : 0;
    amountsByDate[date] = current + amount;
  });

  // Put totals into an array
  var totalsArray = [];
  var previousAmount = 0;
  for (var date in amountsByDate) {
    var amount = amountsByDate[date] ? amountsByDate[date]*-1 : 0;
    amount = previousAmount + amount;
    totalsArray.push([parseInt(date), amount]);
    previousAmount = amount;
  }
  var graphData = {
    "values": totalsArray
  }
  console.log('cumulative = ');
  console.log(graphData);

  this.body = [graphData];
}