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

  $scope.categoryDescription = function(entry) {
    var category = _.filter($scope.categories, {
      'id': entry.categoryId || ''
    })[0]

    return (category && category.description) || '';
  };

  $scope.operatorOptions = function(rule) {
    var operators = _.filter($scope.operators, function(operator) {
      var match = false
      _.forEach(rule.property.operators, function(operatorId) {
        if (operator.id == operatorId) match = true;
      });
      return match;
    })

    return operators;
  };
});

var properties = [
  {
    name: 'description',
    description: 'Description',
    operators: [0, 1, 2, 3]
  },
  {
    name: 'amount',
    description: 'Amount',
    operators: [4, 5, 6]
  }
];
var operators = [
  {
    id: 0,
    name: 'is',
    description: 'is'
  },
  {
    id: 1,
    name: 'startsWith',
    description: 'starts with'
  },
  {
    id: 2,
    name: 'endsWith',
    description: 'ends with'
  },
  {
    id: 3,
    name: 'contains',
    description: 'contains'
  },
  {
    id: 4,
    name: 'equals',
    description: 'equals'
  },
  {
    id: 5,
    name: 'greaterThan',
    description: 'is greater than'
  },
  {
    id: 6,
    name: 'lessThan',
    description: 'is less than'
  }
];