'use strict';

var _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// EXPORTS

module.exports.getRules = getRules;
module.exports.createRule = createRule;
module.exports.updateRule = updateRule;
module.exports.deleteRule = deleteRule;
module.exports.applyRules = applyRules;

// EXPORTED FUNCTIONS

function *getRules() {
  // get active rules
  var rules = yield mongo.rules.find({"deletedTime": {"$exists": false}}).toArray();
  rules.forEach(function (rule) {
    rule.id = rule._id;
    delete rule._id;
  });
  console.log('rules = ');
  console.log(rules);
  var sortedRules = sortRules(rules);
  console.log('sorted = ');
  console.log(sortedRules);

  return sortRules(rules);
}

function *createRule(rule) {
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

  return results;
}

function *updateRule(id, rule) {
  id = ObjectID(id);

  // get rule prior to update
  var oldRule = yield getRule(id);

  // get related rules
  var nextRule = yield getRule(rule.next);
  var prevRule = yield getRule(rule.prev);
  var oldNextRule = yield getRule(oldRule.next);
  var oldPrevRule = yield getRule(oldRule.prev);

  // update rule record
  var results = yield mongo.rules.update({_id: id}, rule);

  // update related rules
  updateRelatedRule(nextRule, 'prev', rule._id);
  updateRelatedRule(prevRule, 'next', rule._id);
  if (oldRule) {
    updateRelatedRule(oldNextRule, 'prev', oldRule.prev);
    updateRelatedRule(oldPrevRule, 'next', oldRule.next);
  }

  return results;
}

function *deleteRule(id) {
  id = ObjectID(id);

  // get rule prior to update
  var oldRule = yield getRule(id);

  // get related rules
  var nextRule = yield getRule(oldRule.next);
  var prevRule = yield getRule(oldRule.prev);

  // set rule to inactive
  var results = yield mongo.rules.update({_id: id}, {$set: {
    deletedTime: new Date(),
    next: null,
    prev: null
  }});
  console.log('whoooooooooooooooooooooooooo')
  // update related rules
  yield updateRelatedRule(nextRule, 'prev', prevRule && prevRule._id);
  yield updateRelatedRule(prevRule, 'next', nextRule && nextRule._id);

  return results;
}

function *applyRules(entries) {
  // get all rules
  var rules = yield getRules();

  // get entries to update
  var changes = getChanges(rules, entries);

  // update entries with changes
  yield updateEntries(changes);  
}

// FUNCTIONS

function sortRules(rules) {
  // sort by priority
  var sortedRules = [];
  rules.forEach(function (rule) {
    if (!rule.next) {
      console.log('push = ');
      console.log(rule);
      sortedRules.push(rule);
    } else {
      var index = _.indexOf(sortedRules, _.filter(sortedRules, function(sortedRule) {
        return sortedRule.id === rule.next;
      })[0]);
      console.log('add '+index+' = ');
      console.log(rule);
      sortedRules.splice(index, 0, rule);
    }
  });
  return sortedRules;
}

function *getRule(id) {
  return yield mongo.rules.findOne({
    "deletedTime": {"$exists": false},
    "_id": id
  });
}

function *updateRelatedRule(relatedRule, property, value) {
  if (relatedRule && relatedRule[property] !== value) {
    relatedRule.updatedTime = new Date();
    relatedRule[property] = value;
    return yield mongo.rules.update({_id: relatedRule._id}, relatedRule);
  }
}

function *updateEntries(changes) {
  for (var categoryId in changes) {

    // update entries for each category id
    console.log(changes[categoryId].length + ' records changing to ' + categoryId);
    yield mongo.entries.update({_id: {$in:changes[categoryId]}}, {$set: {
      categoryId: categoryId,
      updatedTime: new Date()
    }}, {multi: true});
  }
}

function getChanges(rules, entries) {
  return _.reduce(entries, function(changes, entry) {

    // apply rules to each entry and mutate changes accumulator 
    return updateChanges(changes, rules, entry);
  }, {});
}

function updateChanges(changes, rules, entry) {
  _.every(rules, function(rule) {

    // apply each rule to the entry
    if (applyRule(rule, entry)) {

      // do not change if the category id is already correct
      if (entry.categoryId === rule.categoryId) return false;

      // add to changes accumulator if rule updates entry category id
      changes[rule.categoryId] = changes[rule.categoryId] || [];
      changes[rule.categoryId].push(entry.id);

      // dont apply any more rules
      return false;
    }
    return true;
  });
  return changes;
}

function applyRule(rule, entry) {
  // apply operator to entry property, evaluating against the rule value
  return operations[rule.operator](entry[rule.property], rule.value);
}

// OBJECTS

var operations = {
  'is': function(string, comparison) {
    return string === comparison;
  },
  'startsWith': function(string, comparison) {
    return string.slice(0, comparison.length) === comparison;
  },
  'endsWith': function(string, comparison) {
    return string.slice(-comparison.length) === comparison;
  },
  'contains': function(string, comparison) {
    return string.indexOf(comparison) > -1;
  },
  'equals': function(number, comparison) {
    return parseFloat(number) === parseFloat(comparison);
  },
  'greaterThan': function(number, comparison) {
    return parseFloat(number) > parseFloat(comparison);
  },
  'lessThan': function(number, comparison) {
    return parseFloat(number) < parseFloat(comparison);
  }
};