'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash');

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/entries', listEntries));
  app.use(route.post('/api/entries', createEntry));
  app.use(route.put('/api/entries/:id', updateEntry));
  app.use(route.del('/api/entries/:id', deleteEntry));
};

function *listEntries() {
  this.body = _.filter(entries, {'deletedTime': undefined});
}

function *createEntry() {
  var entry = yield parse(this);

  entry.createdTime = new Date();
  entry.id = entries.length;

  entries.push(entry);

  this.status = 201;
}

function *updateEntry(id) {
  var entry = yield parse(this);
  console.log('****** ' + id);
  var index = findWithId(entries, id);
  if (index > -1) entries[index] = entry;

  this.status = 201;
}

function *deleteEntry(id) {
  var index = findWithId(entries, id);
  if (index > -1) entries[index].deletedTime = new Date();

  this.status = 201;
}

function findWithId(array, id) {
  for(var i = 0; i < array.length; i += 1) {
    if(array[i].id == id) {
      return i;
    }
  }
}


var entries = [
  {
    id: 0,
    bank: 'hsbc',
    date: '12-12-12',
    amount: 12.00,
    description: 'Sainsburys',
    categoryId: 1
  },
  {
    id: 1,
    bank: 'hsbc',
    date: '13-13-13',
    amount: 13.00,
    description: 'Sports Direct',
    categoryId: 2
  },
  {
    id: 2,
    bank: 'firstdirect',
    date: '14-14-14',
    amount: 14.00,
    description: 'Tesco'
  }
]