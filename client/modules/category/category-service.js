angular.module('app.category').factory('CategoryService', function($http) {

  return {
    get: function() {
      return $http.get('/api/categories');
    },
    add: function(category) {
      return $http.post('/api/categories', category);
    },
    update: function(category) {
      return $http.put('/api/categories/' + category.id, category);
    },
    delete: function(category) {
      return $http.delete('/api/categories/' + category.id);
    }
  };
});