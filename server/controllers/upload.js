'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    fs = require('fs'),
    csv = require('fast-csv'),
    moment = require('moment'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/upload/test', test));
};

function *test() {
	var stream = fs.createReadStream("test.csv");
	var entries = yield parsecsv();
	entries.shift(); // remove headers

	yield mongo.entries.insert(entries);
	console.log(entries.length + ' records added');
	
	this.status = 200;
}

function parsecsv() {
	return function(callback) {
		var stream = fs.createReadStream("test.csv");
		var entries = [];
		csv
			.fromStream(stream)
			.on("record", function(data){
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
	}
}