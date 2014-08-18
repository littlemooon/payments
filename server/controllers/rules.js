'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/rules', listRules));
  app.use(route.post('/api/rules', createRule));
  app.use(route.put('/api/rules/:id', updateRule));
  app.use(route.del('/api/rules/:id', deleteRule));
  app.use(route.get('/api/rules/apply', applyRules));
};

function *listRules() {
  var rules = yield mongo.rules.find({"deletedTime": {"$exists": false}}).toArray();

  rules.forEach(function (rule) {
    rule.id = rule._id;
    delete rule._id;
  });

  this.body = rules;
}

function *createRule() {
  var rule = yield parse(this);

  rule.createdTime = new Date();
  var results = yield mongo.rules.insert(rule);

  this.status = 201;
  this.body = results[0]._id.toString();

  rule.id = rule._id;
  delete rule._id;
}

function *updateRule(id) {
  var rule = yield parse(this);
  id = ObjectID(id);

  rule = {
    _id: id,
    updatedTime: new Date(),
    property: rule.property,
    operator: rule.operator,
    value: rule.value,
    categoryId: rule.categoryId
  };
  yield mongo.rules.update({_id: id}, rule);

  this.status = 201;
}

function *deleteRule(id) {
  id = ObjectID(id);

  yield mongo.rules.update({_id: id}, {$set: {deletedTime: new Date()}});

  this.status = 201;
}

function *applyRules() {
  var entries = yield mongo.entries.find({"deletedTime": {"$exists": false}}).toArray();
  var rules = yield mongo.rules.find({"deletedTime": {"$exists": false}}).toArray();
  console.log(rules)
  var changes = _.reduce(entries, function(changes, entry, i) {
    _.every(rules, function(rule) {
      if (applyRule(rule, entry)) {
        if (entry.categoryId === rule.categoryId) return false;
        changes[rule.categoryId] = changes[rule.categoryId] || [];
        changes[rule.categoryId].push(entry._id);
        return false;
      }
      return true;
    })
    return changes;
  }, {});

  for (var categoryId in changes) {
    console.log(changes[categoryId].length + ' records changing to ' + categoryId);
    var result = yield mongo.entries.update({_id: {$in:changes[categoryId]}}, {$set: {
      categoryId: categoryId,
      updatedTime: new Date()
    }}, {multi: true});
  }

  this.status = 201;
}

function applyRule(rule, entry) {
  if (entry[rule.property.toLowerCase()] !== rule.value) {
    return true;
  }
  return false;
}