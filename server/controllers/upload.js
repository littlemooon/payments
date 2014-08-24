'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    fs = require('fs'),
    csv = require('fast-csv'),
    moment = require('moment'),
    entriesService = require('../services/entries-service');

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/upload/test', test));
};

// ROUTE FUNCTIONS

function *test() {
  // parse csv and remove headers
  var entries = yield parseHsbcCsv();
  entries.shift();

  // add parsed entries
  yield entriesService.createEntry(entries);
  console.log(entries.length + ' records added');
  
  // return
  this.status = 200;
}

// FUNCTIONS

function parseHsbcCsv() {
  return function(callback) {
    // get test file
    var stream = fs.createReadStream("test.csv");
    var entries = [];
    csv
      .fromStream(stream)
      .on("record", function(data){

        // transform data
        var entry = {
          createdTime: moment().toDate(),
          bank: 'HSBC',
          date: moment(data[0], 'DD/MM/YYYY').toDate().getTime(),
          description: data[1].replace(/\s{2,}/g, ' '),
          amount: parseFloat(data[2])*-1
        };
        entries.push(entry);
      })
      .on("end", function(){
        callback(/* error: */ null, entries);
     });
  };
}