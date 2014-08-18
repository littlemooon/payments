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
    yield mongo.categories.insert(categories);
  }
};

// seed data

var entries = [];

var categories = [
  {
    description: 'Food',
    type: 'Outgoing'
  },
  {
    description: 'Clothes',
    type: 'Outgoing'
  },
  {
    description: 'Work',
    type: 'Incoming'
  }
];