angular.module('app.manage').controller('ManageCtrl', function($scope, RuleService){

  $scope.edit = false;
  $scope.doEdit = function() {
  	$scope.edit = !$scope.edit;
  };
  $scope.isEdit = function(edit) {
  	return $scope.edit === edit;
  };

  $scope.doRules = function() {
    RuleService.apply();
  };
  
  $scope.tabs = [
    { name: "Entries", route:".entries" },
    { name: "Categories", route:".categories" },
    { name: "Rules", route:".rules" }
  ];
});