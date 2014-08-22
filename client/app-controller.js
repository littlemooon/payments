angular.module('app').controller('AppCtrl', function($scope, $state){

	// DATA

  $scope.mainPage = mainPage;  
  $scope.pages = pages;

  // VIEW FUNCTIONS

  $scope.isActive = function(route) {
    return $state.is(route);
  };
});

// OBJECTS

var mainPage = { name: "Dash", route:"dash" };  
var pages = [
  { name: "Manage", route:"manage.entries" },
  { name: "Upload", route:"upload" }
];