angular.module("TurnosApp").controller("EventStatsCtrl",['$scope', '$location', 'ResourceEvent', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceEvent, $filter, NgTableParams, $timeout) {




	//ResourceEvent.stats({ stat: 'asistencias' }).$promise.then(function(data) {$scope.asistencias = JSON.stringify(data)});
	ResourceEvent.stats({ stat: 'ingresos' }).$promise.then(function(data) {
		$scope.ingresos = JSON.stringify(data)
	});
	
stopLoading();}]);















