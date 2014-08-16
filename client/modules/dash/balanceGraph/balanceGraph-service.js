angular.module('app.dash').factory('BalanceGraphService', function($http) {

  return {
    get: function() {
      return $http.get('/api/graph/balance');
    }
  };
});