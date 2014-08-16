angular.module('app.dash').factory('TotalGraphService', function($http) {

  return {
    getIncoming: function() {
      return $http.get('/api/graph/total/incoming');
    },
    getOutgoing: function() {
      return $http.get('/api/graph/total/outgoing');
    }
  };
});