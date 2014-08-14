angular.module('app.entry').factory('GraphDataService', function($http) {

  return {
    getTime: function() {
      return $http.get('/api/data/time');
    },
    getPie: function() {
      return $http.get('/api/data/pie');
    },
    getCumulative: function() {
      return $http.get('/api/data/cumulative');
    }
  };
});