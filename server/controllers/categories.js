'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/categories', listCategories));
  app.use(route.post('/api/categories', createCategory));
  app.use(route.put('/api/categories/:id', updateCategory));
  app.use(route.del('/api/categories/:id', deleteCategory));
};

// ROUTE FUNCTIONS

function *listCategories() {
  // get active categories
  var categories = yield mongo.categories.find({"deletedTime": {"$exists": false}}).toArray();
  categories.forEach(function (category) {
    category.id = category._id;
    delete category._id;
  });

  // return
  this.body = categories;
}

function *createCategory() {
  // get new category
  var category = yield parse(this);
  category.createdTime = new Date();

  // create record
  var results = yield mongo.categories.insert(category);
  
  // return
  this.status = 201;
  this.body = results[0]._id.toString();
}

function *updateCategory(id) {
  // get category to update
  var category = yield parse(this);
  id = ObjectID(id);
  category = {
    _id: id, 
    updatedTime: new Date(), 
    description: category.description, 
    type: category.type
  };

  // update record
  var result = yield mongo.categories.update({_id: id}, category);

  // return
  this.status = 201;
}

function *deleteCategory(id) {
  // set category to inactive
  id = ObjectID(id);
  yield mongo.categories.update({_id: id}, {$set: {deletedTime: new Date()}});

  // return
  this.status = 201;
}