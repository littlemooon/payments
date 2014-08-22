'use strict';

var mongo = require('./mongo'),
    ObjectID = mongo.ObjectID;

// EXPORTS

module.exports = function *(overwrite) {
  var count = yield mongo.entries.count({}, {limit: 1});
  if (overwrite || count === 0) {

    // clear database
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

// SEED DATA

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