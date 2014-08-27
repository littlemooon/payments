angular.module('app.rule').controller('RuleCtrl', function($scope, RuleService, CategoryService) {

  // DATA

  RuleService.get().success(function(data) {
    $scope.rules =  data;
  });
  CategoryService.get().success(function(categories) {
    $scope.categories =  categories;
  });

  $scope.properties = properties;
  $scope.operators = operators;
  $scope.newRule = {
    property: $scope.properties[0].id,
    operator: $scope.operators[0].id
  };

  // IO FUNCTIONS

  $scope.addRule = function(rule) {
    // create rule
    rule.next = $scope.rules[0] && $scope.rules[0].id;
    RuleService.add(rule).success(function (ruleId) {

      // add to scope
      rule.id = ruleId;
      $scope.rules.unshift(rule);    
    });

    // reset new rule
    $scope.newRule = {
      property: $scope.newRule.property,
      operator: $scope.newRule.operator
    };
  };
  $scope.updateRule = function(rule) {
    RuleService.update(rule);
  };
  $scope.deleteRule = function(rule) {
    // delete rule
    RuleService.delete(rule);

    // remove from scope
    var index = $scope.rules.indexOf(rule);
    if (index > -1) $scope.rules.splice(index, 1);
  };

  // VIEW FUNCTIONS

  $scope.getPriority = function(rule) {
    // get index of sorted rules
    return _.indexOf($scope.rules, rule)+1;
  };
  $scope.increasePriority = function(rule) {
    // move rule within array
    var index = _.indexOf($scope.rules, rule);
    if (index > 0) {
      $scope.rules.splice(index-1, 0, _.remove($scope.rules, rule)[0]);

      // update rule
      $scope.rules[index-1].next = $scope.rules[index] && $scope.rules[index].id;
      $scope.rules[index-1].prev = $scope.rules[index-2] && $scope.rules[index-2].id;
      RuleService.update(rule);
    }
  };
  $scope.decreasePriority = function(rule) {
    // move rule within array
    var index = _.indexOf($scope.rules, rule);
    if (index < $scope.rules.length-1) {
      $scope.rules.splice(index+1, 0, _.remove($scope.rules, rule)[0]);

      // update rule
      $scope.rules[index+1].next = $scope.rules[index+2] && $scope.rules[index+2].id;
      $scope.rules[index+1].prev = $scope.rules[index] && $scope.rules[index].id;
      RuleService.update(rule);
    }
  };

  $scope.getDescription = function(id, collection) {
    // get description property for object in collection with id
    var object = _.filter(collection, { 'id': id })[0];
    return (object && object.description) || '';
  };

  $scope.operatorOptions = function(rule) {
    var operators = _.filter($scope.operators, function(operator) {
      var match = false;

      // add to list of operators to if the operator id is associated to the property
      _.forEach(getOperatorIds(rule.property), function(operatorId) {
        if (operator.id == operatorId) match = true;
      });
      return match;
    });
    return operators;
  };

  function getOperatorIds(propertyId) {
    // get operators associated to the property
    var property = _.filter($scope.properties, { 'id': propertyId })[0];
    return (property && property.operators) || [];
  }
});

// OBJECTS

var properties = [
  {
    id: 'description',
    description: 'Description',
    operators: ['contains', 'is', 'startsWith', 'endsWith']
  },
  {
    id: 'amount',
    description: 'Amount',
    operators: ['greaterThan', 'lessThan', 'equals']
  }
];
var operators = [
  {
    id: 'contains',
    description: 'contains'
  },
  {
    id: 'is',
    description: 'is'
  },
  {
    id: 'startsWith',
    description: 'starts with'
  },
  {
    id: 'endsWith',
    description: 'ends with'
  },
  {
    id: 'greaterThan',
    description: 'is greater than'
  },
  {
    id: 'lessThan',
    description: 'is less than'
  },
  {
    id: 'equals',
    description: 'equals'
  }
];