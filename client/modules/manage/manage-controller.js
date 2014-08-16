angular.module('app.manage').controller('ManageCtrl', function($scope){

  $scope.edit = false;
  $scope.doEdit = function() {
  	$scope.edit = true;
  };
  $scope.isEdit = function(edit) {
  	return $scope.edit === edit;
  };

  $scope.doSave = function() {
  	$scope.edit = false;
  };
  
  $scope.tabs = [
    { name: "Entries", route:".entries" },
    { name: "Categories", route:".categories" },
    { name: "Defaults", route:".defaults" }
  ];
});