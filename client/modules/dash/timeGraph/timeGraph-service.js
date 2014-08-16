angular.module('app.dash').factory('TimeGraphService', function($http) {

  return {
    getIncoming: function() {
      return $http.get('/api/graph/time/incoming');
    },
    getOutgoing: function() {
      return $http.get('/api/graph/time/outgoing');
    }
  };
});