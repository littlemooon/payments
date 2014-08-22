'use strict';

var _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// EXPORTS

module.exports.getEntries = getEntries;
module.exports.getOutgoingEntries = getOutgoingEntries;
module.exports.getIncomingEntries = getIncomingEntries;
module.exports.createEntry = createEntry;
module.exports.updateEntry = updateEntry;
module.exports.deleteEntry = deleteEntry;

// EXPORTED FUNCTIONS

function *getEntries() {
  // get active entries by date
  var entries = yield mongo.entries.find({"deletedTime": {"$exists": false}}).sort({date: 1}).toArray();
  entries.forEach(function (entry) {
    entry.id = entry._id;
    delete entry._id;
  });

  return entries;
}

function *getOutgoingEntries() {
  // get entries with positive amount
  return yield mongo.entries.find({
    "deletedTime": {"$exists": false},
    "amount": { "$gt": 0 }
  }).sort({date: 1}).toArray();
}

function *getIncomingEntries() {
  var entries = [];
  // get entries with a negative amount
  entries = yield mongo.entries.find({
    "deletedTime": {"$exists": false},
    "amount": { "$lt": 0 }
  }).sort({date: 1}).toArray();

  // transform the amount
  entries = _.map(entries, function(entry) {
    entry.amount = entry.amount *-1;
    return entry;
  });
  return entries;
}

function *createEntry(entry) {
  return yield mongo.entries.insert(entry);
}

function *updateEntry(id, entry) {
  return yield mongo.entries.update({_id: ObjectID(id)}, entry);
}

function *deleteEntry(id) {
  return yield mongo.entries.update({_id: ObjectID(id)}, {$set: {deletedTime: new Date()}});
}