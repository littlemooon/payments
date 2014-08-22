angular.module('app.manage').controller('ManageCtrl', function($scope, RuleService){

  // DATA
  
  $scope.tabs = tabs;
  $scope.edit = false;

  // VIEW FUNCTIONS

  $scope.doEdit = function() {
  	$scope.edit = !$scope.edit;
  };
  $scope.isEdit = function(edit) {
  	return $scope.edit === edit;
  };

  $scope.doRules = function() {
    RuleService.apply();
  };
});

// OBJECTS

var tabs = [
  { name: "Entries", route:".entries" },
  { name: "Categories", route:".categories" },
  { name: "Rules", route:".rules" }
];