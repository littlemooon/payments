'use strict';

var _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// EXPORTS

module.exports.applyRules = applyRules;

// FUNCTIONS

function *applyRules(rules, entries) {
  // get entries to update
  var changes = getChanges(rules, entries);

  // update entries with changes
  yield updateEntries(changes);  
}

function *updateEntries(changes) {
  for (var categoryId in changes) {

    // update entries for each category id
    console.log(changes[categoryId].length + ' records changing to ' + categoryId);
    var result = yield mongo.entries.update({_id: {$in:changes[categoryId]}}, {$set: {
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
      changes[rule.categoryId].push(entry._id);

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
