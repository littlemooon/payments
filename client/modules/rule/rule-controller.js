angular.module('app.rule').controller('RuleCtrl', function($scope, RuleService, CategoryService) {

  RuleService.get().
    success(function(data) {
      $scope.rules =  data;
    });
  CategoryService.get().
    success(function(categories) {
      $scope.categories =  categories;
    });

  $scope.properties = [
    'Date',
    'Description'
  ];
  $scope.operators = [
    'is',
    'is not'
  ];

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
});