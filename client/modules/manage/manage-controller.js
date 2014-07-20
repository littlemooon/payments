angular.module('app.manage').controller('ManageCtrl', function($scope, $state, $location, CategoryService, EntryService){

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

  // Tabs
  
  $scope.tabs = [
    { name: "Entries", route:".entries" },
    { name: "Categories", route:".categories" },
    { name: "Defaults", route:".defaults" }
  ];  

  // Entries

  EntryService.get().
    success(function(entries) {
      $scope.entries =  entries;
    });
  $scope.categoryDescription = function(entry) {
    return _.filter($scope.categories, {'id': entry.categoryId})[0].description;
  };

  $scope.newEntry = {};

  $scope.addEntry = function(entry) {
    EntryService.add(entry).success(function (entryId) {
      entry.id = entryId;
      $scope.entries.unshift(entry);    
    })
    $scope.newEntry = {};
  };
  $scope.updateEntry = function(entry) {
    EntryService.update(entry);
  };
  $scope.deleteEntry = function(entry) {
    EntryService.delete(entry);
    var index = $scope.entries.indexOf(entry);
    if (index > -1) {
        $scope.entries.splice(index, 1);
    }
  };

  // Categories

  CategoryService.get().
    success(function(categories) {
      $scope.categories =  categories;
    });

  $scope.colors = colors;
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
});

var colors = [
  {
    id: 0,
    name: 'red'
  },
  {
    id: 1,
    name: 'blue'
  },
  {
    id: 2,
    name: 'green'
  }
]