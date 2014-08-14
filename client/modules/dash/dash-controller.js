angular.module('app.dash').controller('DashCtrl', function($scope, $location, GraphDataService) {

	$scope.tagline = 'To the moon and back!';	

	GraphDataService.getTime().
    success(function(data) {
		  $scope.timeData = data;
		});
	GraphDataService.getPie().
    success(function(data) {
		  $scope.pieData = data;
		});
	GraphDataService.getCumulative().
    success(function(data) {
		  $scope.cumulativeData = data;
		});


	$scope.timeOptions = {
	  chart: {
	    type: 'stackedAreaChart',
	    height: 250,
	    margin : {
	      top: 20,
	      right: 20,
	      bottom: 60,
	      left: 40
	    },
	    x: function(d){return d[0];},
	    y: function(d){return d[1];},
	    useVoronoi: false,
	    clipEdge: true,
	    transitionDuration: 500,
	    useInteractiveGuideline: true,
	    xAxis: {
	      showMaxMin: false,
	      tickFormat: function(d) {
	        return d3.time.format('%x')(new Date(d))
	      }
	    },
	    yAxis: {
	      tickFormat: function(d){
	        return d3.format(',.2f')(d);
	      }
	    }
	  }
	};
  $scope.pieOptions = {chart: {
    type: 'pieChart',
    height: 300,
    x: function(d){return d.key;},
    y: function(d){return d.y;},
    showLabels: true,
    transitionDuration: 500,
    labelThreshold: 0.01,
    legend: {
        margin: {
          top: 5,
          right: 35,
          bottom: 5,
          left: 0
        }
      }
    }
  };
	$scope.cumulativeOptions = {
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