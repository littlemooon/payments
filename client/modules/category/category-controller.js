angular.module('app.category').controller('CategoryCtrl', function($scope, CategoryService){

  CategoryService.get().
    success(function(categories) {
      $scope.categories =  categories;
    });

  $scope.newCategory = {};

  $scope.addCategory = function(category) {
    CategoryService.add(category).success(function (categoryId) {
      category.id = categoryId;
      $scope.categories.unshift(category);    
    })
    $scope.newCategory = {};
  };
  $scope.updateCategory = function(category) {
    CategoryService.update(category);
  };
  $scope.deleteCategory = function(category) {
    CategoryService.delete(category);
    var index = $scope.categories.indexOf(category);
    if (index > -1) {
        $scope.categories.splice(index, 1);
    }
  };

  $scope.types = ['Incoming', 'Outgoing'];
});