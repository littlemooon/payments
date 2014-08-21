angular.module('app.rule').controller('RuleCtrl', function($scope, RuleService, CategoryService) {

  RuleService.get().
    success(function(data) {
      $scope.rules =  data;
    });
  CategoryService.get().
    success(function(categories) {
      $scope.categories =  categories;
    });

  $scope.properties = properties;
  $scope.operators = operators;

  $scope.newRule = {
    property: $scope.properties && $scope.properties[0],
    operator: $scope.operators && $scope.operators[0]
  };

  $scope.addRule = function(rule) {
    RuleService.add(rule).success(function (ruleId) {
      rule.id = ruleId;
      $scope.rules.unshift(rule);    
    })
    $scope.newRule = {};
  };
  $scope.updateRule = function(rule) {
    RuleService.update(rule);
  };
  $scope.deleteRule = function(rule) {
    RuleService.delete(rule);
    var index = $scope.rules.indexOf(rule);
    if (index > -1) {
        $scope.rules.splice(index, 1);
    }
  };

  $scope.getDescription = function(id, collection) {
    var object = _.filter(collection, { 'id': id })[0]
    return (object && object.description) || '';
  };

  $scope.operatorOptions = function(rule) {
    var operators = _.filter($scope.operators, function(operator) {
      var match = false;
      _.forEach(getOperatorIds(rule.property), function(operatorId) {
        if (operator.id == operatorId) match = true;
      });
      return match;
    })

    return operators;
  };

  function getOperatorIds(property) {
      var property = _.filter($scope.properties, {
        'id': property
      })[0]
      return (property && property.operators) || [];
  }
});

var properties = [
  {
    id: 'description',
    description: 'Description',
    operators: ['is', 'startsWith', 'endsWith', 'contains']
  },
  {
    id: 'amount',
    description: 'Amount',
    operators: ['equals', 'greaterThan', 'lessThan']
  }
];
var operators = [
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
    id: 'contains',
    description: 'contains'
  },
  {
    id: 'equals',
    description: 'equals'
  },
  {
    id: 'greaterThan',
    description: 'is greater than'
  },
  {
    id: 'lessThan',
    description: 'is less than'
  }
];