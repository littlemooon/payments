'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    rulesService = require('../services/rules-service'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

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
  // get active rules
  var rules = yield mongo.rules.find({"deletedTime": {"$exists": false}}).toArray();

  // sort by priority
  var sortedRules = [];
  rules.forEach(function (rule) {
    rule.id = rule._id;
    delete rule._id;

    if (!rule.next) {
      sortedRules.push(rule);
    } else if (!rule.prev) {
      sortedRules.unshift(rule);
    } else {
      var index = _.indexOf(sortedRules, _.filter(sortedRules, function(sortedRule) {
        sortedRule.id === rule.next
      })[0]);
      sortedRules[index];
    }
  });

  // return
  this.body = rules;
}

function *createRule() {
  // get new rule
  var rule = yield parse(this);

  // get related rule
  var nextRule = yield mongo.rules.findOne({
    "deletedTime": {"$exists": false},
    "prev": null
  });

  // create new rule record
  rule.createdTime = new Date();
  rule.next = nextRule && nextRule._id;
  var results = yield mongo.rules.insert(rule);

  // update related rule record
  if (nextRule) {
    nextRule.updatedTime = new Date();
    nextRule.prev = rule._id;
    yield mongo.rules.update({_id: nextRule._id}, nextRule);
  }

  // return
  this.status = 201;
  this.body = results[0]._id.toString();
}

function *updateRule(id) {
  // get rule to update
  var rule = yield parse(this);
  id = ObjectID(id);
  rule = {
    _id: id,
    updatedTime: new Date(),
    property: rule.property,
    operator: rule.operator,
    value: rule.value,
    categoryId: rule.categoryId,
    next: rule.next,
    prev: rule.prev
  };

  // get rule prior to update
  var oldRule = yield mongo.rules.findOne({
    "deletedTime": {"$exists": false},
    "_id": id
  });

  // get related rules
  var nextRule = yield mongo.rules.findOne({
    "deletedTime": {"$exists": false},
    "_id": rule.next
  });
  var prevRule = yield mongo.rules.findOne({
    "deletedTime": {"$exists": false},
    "_id": rule.prev
  });
  var oldNextRule = yield mongo.rules.findOne({
    "deletedTime": {"$exists": false},
    "_id": oldRule.next
  });
  var oldPrevRule = yield mongo.rules.findOne({
    "deletedTime": {"$exists": false},
    "_id": oldRule.prev
  });

  // update rule record
  yield mongo.rules.update({_id: id}, rule);

  // update related rules
  if (nextRule) {
    nextRule.updatedTime = new Date();
    nextRule.prev = rule._id;
    yield mongo.rules.update({_id: nextRule._id}, nextRule);
  }
  if (prevRule) {
    prevRule.updatedTime = new Date();
    prevRule.next = rule._id;
    yield mongo.rules.update({_id: prevRule._id}, prevRule);
  }
  if (oldRule && oldNextRule) {
    oldNextRule.updatedTime = new Date();
    oldNextRule.prev = oldRule.prev;
    yield mongo.rules.update({_id: oldNextRule._id}, oldNextRule);
  }
  if (oldRule && oldPrevRule) {
    oldPrevRule.updatedTime = new Date();
    oldPrevRule.next = oldRule.next;
    yield mongo.rules.update({_id: oldPrevRule._id}, oldPrevRule);
  }

  // return
  this.status = 201;
}

function *deleteRule(id) {
  // get rule prior to update
  id = ObjectID(id);
  var rule = yield mongo.rules.findOne({
    "deletedTime": {"$exists": false},
    "_id": id
  });

  // get related rules
  var nextRule = yield mongo.rules.findOne({
    "deletedTime": {"$exists": false},
    "_id": rule.next
  });
  var prevRule = yield mongo.rules.findOne({
    "deletedTime": {"$exists": false},
    "_id": rule.prev
  });

  // set rule to inactive
  yield mongo.rules.update({_id: id}, {$set: {
    deletedTime: new Date(),
    next: null,
    prev: null
  }});

  // update related rules
  if (nextRule) {
    nextRule.updatedTime = new Date();
    nextRule.prev = prevRule && prevRule._id;
    yield mongo.rules.update({_id: nextRule._id}, nextRule);
  }
  if (prevRule) {
    prevRule.updatedTime = new Date();
    prevRule.next = nextRule && nextRule._id;
    yield mongo.rules.update({_id: prevRule._id}, prevRule);
  }

  // return
  this.status = 201;
}

function *applyRules() {
  // get rules and entries
  var rules = yield mongo.rules.find({"deletedTime": {"$exists": false}}).toArray();
  var entries = yield mongo.entries.find({"deletedTime": {"$exists": false}}).toArray();

  // apply rules to entries
  yield rulesService.applyRules(rules, entries);

  // return
  this.status = 201;
}