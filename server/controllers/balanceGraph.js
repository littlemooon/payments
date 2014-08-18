'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/graph/balance', data));
};

function *data() {
  var entries = yield getEntries();

  this.body = getData(entries);
}

function *getEntries() {
  return yield mongo.entries.find({"deletedTime": {"$exists": false}}).sort({date: 1}).toArray();
}

function getData(entries) {
  // Get total amount spent by date
  var amountsByDate = {};
  _.each(entries, function(entry, i) {
    var date = entry.date;
    var amount = entry.amount;

    var current = amountsByDate[date] || 0;
    amountsByDate[date] = current + amount;
  });

  // Put totals into an array
  var totalsArray = [];
  var previousAmount = 0;
  for (var date in amountsByDate) {
    var amount = amountsByDate[date] ? amountsByDate[date]*-1 : 0;
    amount = previousAmount + amount;
    totalsArray.push([date, amount]);
    previousAmount = amount;
  };
  var data = [{
    "key": 'Total',
    "values": totalsArray
  }];

  // Group amounts for each bank by date
  amountsByDate = {};
  _.each(entries, function(entry) {
    var date = entry.date;
    var bank = entry.bank;
    var amount = parseFloat(entry.amount);

    amountsByDate[bank] = amountsByDate[bank] || {};
    var current = amountsByDate[bank][date] || 0;
    amountsByDate[bank][date] = current + amount;
  });

  // Put amounts by date into the data array
  for (var bank in amountsByDate) {
    var dataForBank = [];
    var previousAmount = 0;

    for (var date in amountsByDate[bank]) {
      var amount = amountsByDate[bank][date]*-1 || 0;
      amount = previousAmount + amount;
      dataForBank.push([parseInt(date), amount]);
      previousAmount = amount;
    }
    console.log(dataForBank);

    data.push({
      "key": bank,
      "values": dataForBank
    })
  };
  // console.log('bank = ');
  // console.log(data);
  
  return data;
}