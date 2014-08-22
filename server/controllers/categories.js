'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    categoriesService = require('../services/categories-service');

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
  var categories = yield categoriesService.getAllCategories();

  // return
  this.body = categories;
}

function *createCategory() {
  // get new category
  var category = yield parse(this);
  category.createdTime = new Date();

  // create record
  var results = yield categoriesService.createCategory(category);
  
  // return
  this.status = 201;
  this.body = results[0]._id.toString();
}

function *updateCategory(id) {
  // get category to update
  var category = yield parse(this);
  category = {
    updatedTime: new Date(), 
    description: category.description, 
    type: category.type
  };

  // update record
  yield categoriesService.updateCategory(id, category);

  // return
  this.status = 201;
}

function *deleteCategory(id) {
  // set category to inactive
  yield categoriesService.deleteCategory(id);

  // return
  this.status = 201;
}