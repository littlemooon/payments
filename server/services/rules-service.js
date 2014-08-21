'use strict';

var thunkify = require('thunkify'),
    _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

module.exports.applyRules = applyRules;

function *applyRules(rules, entries) {
  var changes = getChanges(rules, entries);
  console.log(changes);
  yield updateEntries(changes);  
}

function *updateEntries(changes) {
  console.log('Updating entries');
    for (var categoryId in changes) {
      console.log(changes[categoryId].length + ' records changing to ' + categoryId);
      var result = yield mongo.entries.update({_id: {$in:changes[categoryId]}}, {$set: {
        categoryId: categoryId,
        updatedTime: new Date()
      }}, {multi: true});
    }
}

function getChanges(rules, entries) {
  return _.reduce(entries, function(changes, entry) {
    return updateChanges(changes, rules, entry);
  }, {});
}

function updateChanges(changes, rules, entry) {
  _.every(rules, function(rule) {
    if (applyRule(rule, entry)) {
      if (entry.categoryId === rule.categoryId) return false;
      changes[rule.categoryId] = changes[rule.categoryId] || [];
      changes[rule.categoryId].push(entry._id);
      return false;
    }
    return true;
  });
  return changes;
}

function applyRule(rule, entry) {
  return operations[rule.operator](entry[rule.property], rule.value);
}

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
}
