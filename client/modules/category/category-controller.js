angular.module('app.category').controller('CategoryCtrl', function($scope, CategoryService){

  // DATA

  CategoryService.get().
    success(function(categories) {
      $scope.categories =  categories;
    });

  $scope.newCategory = {
    type: types[0]
  };
  $scope.types = types;

  // IO FUNCTIONS

  $scope.addCategory = function(category) {
    // create category
    CategoryService.add(category).success(function (categoryId) {

      // add to scope
      category.id = categoryId;
      $scope.categories.unshift(category);
    });

    // reset new category
    $scope.newCategory = {
      type: $scope.newCategory.type
    };
  };
  $scope.updateCategory = function(category) {
    CategoryService.update(category);
  };
  $scope.deleteCategory = function(category) {
    // delete category
    CategoryService.delete(category);

    // remove from scope
    var index = $scope.categories.indexOf(category);
    if (index > -1) $scope.categories.splice(index, 1);
  };
});

// OBJECTS

var types = ['Outgoing', 'Incoming'];