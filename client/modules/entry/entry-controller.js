angular.module('app.entry').controller('EntryCtrl', function($scope, EntryService, CategoryService){

  // DATA

  EntryService.get().
    success(function(entries) {
      $scope.entries =  entries;
    });
  CategoryService.get().
    success(function(categories) {
      $scope.categories =  categories;
    });

  $scope.newEntry = newEntry;

  // IO FUNCTIONS

  $scope.addEntry = function(entry) {
    // create entry
    EntryService.add(entry).success(function (entryId) {

      // add to scope
      entry.id = entryId;
      $scope.entries.unshift(entry);    
    })

    // reset new entry
    $scope.newEntry = newEntry;
  };
  $scope.updateEntry = function(entry) {
    EntryService.update(entry);
  };
  $scope.deleteEntry = function(entry) {
    // delete entry
    EntryService.delete(entry);

    // remove from scope
    var index = $scope.entries.indexOf(entry);
    if (index > -1) $scope.entries.splice(index, 1);
  };

  // VIEW FUNCTIONS

  $scope.categoryDescription = function(entry) {
    // get description for category that matches entry category id
    var category = _.filter($scope.categories, {
      'id': entry.categoryId || ''
    })[0];
    return (category && category.description) || '';
  };
  $scope.categoryOptions = function(entry) {
    // get categories with a type that matches entry amount
    var type = entry.amount > 0 ? 'Outgoing' : 'Incoming';
    return _.filter($scope.categories, {
      'type': type
    });
  };
});

// OBJECTS

var newEntry = {
  amount: 0
};