angular.module("TurnosApp").controller("EventIndexCtrl",['$scope', '$location', 'ResourceEvent', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceEvent, $filter, NgTableParams, $timeout) {
	$scope.events = [];
	ResourceEvent.index().$promise.then(function(data) {
		$scope.events = data;
		stopLoading();
	});
}]);















