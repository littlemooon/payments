'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    entriesService = require('../services/entries-service'),
    categoriesService = require('../services/categories-service');

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/graph/time/outgoing', dataOutgoing));
  app.use(route.get('/api/graph/time/incoming', dataIncoming));
};

// ROUTE FUNCTIONS

function *dataOutgoing() {
  // get data for outgoing entries
  var entries = yield entriesService.getOutgoingEntries();
  var categories = yield categoriesService.getOutgoingCategories();

  // transform entries and categories
  this.body = dataTransform(entries, categories);
}

function *dataIncoming() {
  // get data for incoming entries
  var entries = yield entriesService.getIncomingEntries();
  var categories = yield categoriesService.getIncomingCategories();

  // transform entries and categories
  this.body = dataTransform(entries, categories);
}

// FUNCTIONS

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