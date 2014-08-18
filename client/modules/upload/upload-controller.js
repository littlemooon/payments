angular.module('app.upload').controller('UploadCtrl', function($scope, UploadService) {

	$scope.test = function() {
		UploadService.get();
	};

});