angular.module("TurnosApp").controller("EventStatsCtrl",['$scope', '$location', 'ResourceEvent', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceEvent, $filter, NgTableParams, $timeout) {




	//ResourceEvent.stats({ stat: 'asistencias' }).$promise.then(function(data) {$scope.asistencias = JSON.stringify(data)});
	ResourceEvent.stats({ stat: 'ingresos' }).$promise.then(function(data) {
		$scope.ingresos = JSON.stringify(data)
	});
	
	
	
	var config = {
	  type: 'bar',
	  data: {
		labels: ["January", "February", "March", "April", "May", "June", "July"],
		datasets: [{
		  type: 'bar',
		  label: 'Dataset 1',
		  backgroundColor: "red",
		  data: [65, 0, 80, 81, 56, 85, 40],
		}, {
		  type: 'bar',
		  label: 'Dataset 3',
		  backgroundColor: "blue",
		  data: [65, 0, -80, -81, -56, -85, -40]
		}]
	  },
	  options: {
		scales: {
		  xAxes: [{
			stacked: true
		  }],
		  yAxes: [{
			stacked: true
		  }]
		}
	  }
	};

	var ctx = document.getElementById("asistenciasChart");
	new Chart(ctx, config);
	
	
	
	
	
	
	
	
	
	
	
	
stopLoading();}]);















