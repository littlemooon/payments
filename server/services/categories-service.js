'use strict';

var mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// EXPORTS

module.exports.getAllCategories = getAllCategories;
module.exports.getOutgoingCategories = getOutgoingCategories;
module.exports.getIncomingCategories = getIncomingCategories;
module.exports.createCategory = createCategory;
module.exports.updateCategory = updateCategory;
module.exports.deleteCategory = deleteCategory;

// EXPORTED FUNCTIONS

function *getAllCategories() {
  var categories = yield mongo.categories.find({"deletedTime": {"$exists": false}}).toArray();
  categories.forEach(function (category) {
    category.id = category._id;
    delete category._id;
  });

  return categories;
}

function *getOutgoingCategories() {
  return yield mongo.categories.find({
    "deletedTime": {"$exists": false},
    "type": 'Outgoing'
  }).toArray();
}

function *getIncomingCategories() {
  return yield mongo.categories.find({
    "deletedTime": {"$exists": false},
    "type": 'Incoming'
  }).toArray();
}

function *createCategory(category) {
  return yield mongo.categories.insert(category);
}

function *updateCategory(id, category) {
  return yield mongo.categories.update({_id: ObjectID(id)}, category);
}

function *deleteCategory(id) {
  return yield mongo.categories.update({_id: ObjectID(id)}, {$set: {deletedTime: new Date()}});
}