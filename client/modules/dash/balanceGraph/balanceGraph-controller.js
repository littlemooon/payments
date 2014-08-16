angular.module('app.dash').controller('BalanceGraphCtrl', function($scope, BalanceGraphService) {

	BalanceGraphService.get().
    success(function(data) {
		  $scope.data = data;
		});

	$scope.options = {
	  chart: {
	    type: 'lineChart',
	    height: 200,
	    margin : {
	      top: 20,
	      right: 20,
	      bottom: 60,
	      left: 65
	    },
	    x: function(d){ return d[0]; },
	    y: function(d){ return d[1]; },

	    color: d3.scale.category10().range(),
	    transitionDuration: 300,
	    useInteractiveGuideline: true,
	    clipVoronoi: false,
	  }
	};
});