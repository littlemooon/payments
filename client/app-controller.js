angular.module('app').controller('AppCtrl', function($scope, $state){

  $scope.mainPage = { name: "Dash", route:"dash" };  
  $scope.pages = [
    { name: "Manage", route:"manage.entries" },
    { name: "Upload", route:"upload" }
  ];

  $scope.isActive = function(route) {
    return $state.is(route);
  };
});