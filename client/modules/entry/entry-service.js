angular.module('app.entry').factory('EntryService', function($http) {

  return {
    get: function() {
      return $http.get('/api/entries');
    },
    add: function(entry) {
      return $http.post('/api/entries', entry);
    },
    update: function(entry) {
      return $http.put('/api/entries/' + entry.id, entry);
    },
    delete: function(entry) {
      return $http.delete('/api/entries/' + entry.id);
    }
  };
});