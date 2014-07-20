'use strict';

var mongo = require('./mongo'),
    ObjectID = mongo.ObjectID;

/**
 * Clears and populates db with seed data
 * @param overwrite Overwrite existing database even if it is not empty
 */
module.exports = function *(overwrite) {
  var count = yield mongo.entries.count({}, {limit: 1});
  if (overwrite || count === 0) {

    // clear
    for (var collection in mongo) {
      if (mongo[collection].drop) {
        try {
          yield mongo[collection].drop();
        } catch (err) {
          if (err.message !== 'ns not found') { // indicates 'collection not found' error in mongo which is ok
            throw err;
          }
        }
      }
    }

    // populate with seed data
    yield mongo.counters.insert({_id: 'entryId', seq: entries.length});
    yield mongo.entries.insert(entries);
    yield mongo.categories.insert(categories);
  }
};

// seed data

var entries = [
  {
    bank: 'hsbc',
    date: '12-12-12',
    amount: 12.00,
    description: 'Sainsburys',
    categoryId: 1
  },
  {
    bank: 'hsbc',
    date: '13-13-13',
    amount: 13.00,
    description: 'Sports Direct',
    categoryId: 2
  },
  {
    bank: 'firstdirect',
    date: '14-14-14',
    amount: 14.00,
    description: 'Tesco'
  }
];

var categories = [
  {
    id: 0,
    description: 'food'
  },
  {
    id: 1,
    description: 'clothes'
  }
];