'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    entriesService = require('../services/entries-service');

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/graph/balance', getData));
};

// ROUTE FUNCTIONS

function *getData() {
  // get entries
  var entries = yield entriesService.getEntries();

  // transform entries
  this.body = dataTransform(entries);
}

// FUNCTIONS

function dataTransform(entries) {
  // get total amount spent by date
  var amountsByDate = {};
  _.each(entries, function(entry, i) {
    var date = entry.date;
    var amount = entry.amount;

    // update total for each entry by date
    var current = amountsByDate[date] || 0;
    amountsByDate[date] = current + amount;
  });

  // save totals by date
  var totalsArray = [];
  var previousAmount = 0;
  for (var date in amountsByDate) {
    var amount = amountsByDate[date] ? amountsByDate[date]*-1 : 0;
    amount = previousAmount + amount;
    totalsArray.push([date, amount]);
    previousAmount = amount;
  };

  // add totals to return data array
  var data = [{
    "key": 'Total',
    "values": totalsArray
  }];

  // group amounts for each bank by date
  amountsByDate = {};
  _.each(entries, function(entry) {
    var date = entry.date;
    var bank = entry.bank;
    var amount = parseFloat(entry.amount);

    // update total for each entry by bank and date
    amountsByDate[bank] = amountsByDate[bank] || {};
    var current = amountsByDate[bank][date] || 0;
    amountsByDate[bank][date] = current + amount;
  });

  // save totals for each bank
  for (var bank in amountsByDate) {
    var dataForBank = [];
    var previousAmount = 0;

    for (var date in amountsByDate[bank]) {
      var amount = amountsByDate[bank][date]*-1 || 0;
      amount = previousAmount + amount;
      dataForBank.push([date, amount]);
      previousAmount = amount;
    }

    // add bank totals to return data array
    data.push({
      "key": bank,
      "values": dataForBank
    })
  };

  // console.log('bank = ');
  // console.log(data);
  return data;
}