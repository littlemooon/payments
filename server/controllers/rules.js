'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    rulesService = require('../services/rules-service'),
    entriesService = require('../services/entries-service');

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/rules', listRules));
  app.use(route.post('/api/rules', createRule));
  app.use(route.put('/api/rules/:id', updateRule));
  app.use(route.del('/api/rules/:id', deleteRule));
  app.use(route.get('/api/rules/apply', applyRules));
};

// ROUTE FUNCTIONS

function *listRules() {
  // get active rules sorted by priority
  var rules = yield rulesService.getRules();

  // return
  this.body = rules;
}

function *createRule() {
  // get new rule
  var rule = yield parse(this);

  // create new rule
  var results = yield rulesService.createRule(rule);

  // return
  this.status = 201;
  this.body = results[0]._id.toString();
}

function *updateRule(id) {
  // get rule to update
  var rule = yield parse(this);
  rule = {
    updatedTime: new Date(),
    property: rule.property,
    operator: rule.operator,
    value: rule.value,
    categoryId: rule.categoryId,
    next: rule.next,
    prev: rule.prev
  };

  // update record
  yield rulesService.updateRule(id, rule);

  // return
  this.status = 201;
}

function *deleteRule(id) {
  // set rule to inactive
  yield rulesService.deleteRule(id);

  // return
  this.status = 201;
}

function *applyRules() {
  // get all entries
  var entries = yield entriesService.getEntries();

  // apply rules to entries
  yield rulesService.applyRules(entries);

  // return
  this.status = 201;
}