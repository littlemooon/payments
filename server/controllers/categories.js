'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash');

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/categories', listCategories));
  app.use(route.post('/api/categories', createCategory));
  app.use(route.put('/api/categories/:id', updateCategory));
  app.use(route.del('/api/categories/:id', deleteCategory));
};

function *listCategories() {
  this.body = _.filter(categories, {'deletedTime': undefined});
}

function *createCategory() {
  var category = yield parse(this);

  category.createdTime = new Date();
  category.id = categories.length;

  categories.push(category);

  this.status = 201;
}

function *updateCategory(id) {
  var category = yield parse(this);

  var index = findWithId(categories, id);
  if (index > -1) categories[index] = category;

  this.status = 201;
}

function *deleteCategory(id) {
  var index = findWithId(categories, id);
  if (index > -1) categories[index].deletedTime = new Date();

  this.status = 201;
}

function findWithId(array, id) {
  for(var i = 0; i < array.length; i += 1) {
    if(array[i].id == id) {
      return i;
    }
  }
}


var categories = [
  {
    id: 0,
    description: 'food'
  },
  {
    id: 1,
    description: 'clothes'
  }
]