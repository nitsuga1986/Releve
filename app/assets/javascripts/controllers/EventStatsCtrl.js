angular.module("TurnosApp").controller("EventStatsCtrl",['$scope', '$location', 'ResourceEvent', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceEvent, $filter, NgTableParams, $timeout) {


	ResourceEvent.stats({ stat: 'PUT' }).$promise.then(function(data) {
		$scope.stats = data;
		stopLoading();
	});

	
}]);















