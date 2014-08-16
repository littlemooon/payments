angular.module('app.entry').controller('EntryCtrl', function($scope, EntryService, CategoryService){

  EntryService.get().
    success(function(entries) {
      $scope.entries =  entries;
    });

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

  CategoryService.get().
    success(function(categories) {
      $scope.categories =  categories;
    });

  $scope.categoryDescription = function(entry) {
    var category = _.filter($scope.categories, {
      'id': entry.categoryId || ''
    })[0]

    return (category && category.description) || '';
  };
  $scope.categoryOptions = function(entry) {
    var type = entry.amount > 0 ? 'Outgoing' : 'Incoming';

    return _.filter($scope.categories, {
      'type': type
    });
  };
});