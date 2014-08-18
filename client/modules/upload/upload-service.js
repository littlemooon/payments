angular.module('app.upload').factory('UploadService', function($http) {

  return {
    get: function() {
      return $http.get('/api/upload/test');
    }
  };
});