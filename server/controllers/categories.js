'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/categories', listCategories));
  app.use(route.post('/api/categories', createCategory));
  app.use(route.put('/api/categories/:id', updateCategory));
  app.use(route.del('/api/categories/:id', deleteCategory));
};

function *listCategories() {
  var categories = yield mongo.categories.find().toArray();

  categories.forEach(function (category) {
    category.id = category._id;
    delete category._id;
  });

  this.body = _.filter(categories, {'deletedTime': undefined});
}

function *createCategory() {
  var category = yield parse(this);

  category.createdTime = new Date();
  var results = yield mongo.categories.insert(category);

  this.status = 201;
  this.body = results[0]._id.toString();

  category.id = category._id;
  delete category._id;
}

function *updateCategory(id) {
  var category = yield parse(this);
  id = ObjectID(id);

  category = {_id: id, createdTime: new Date(), description: category.description};
  var result = yield mongo.categories.update({_id: id}, category);

  this.status = 201;
}

function *deleteCategory(id) {
  id = ObjectID(id);

  yield mongo.categories.update({_id: id}, {$set: {deletedTime: new Date()}});

  this.status = 201;
}