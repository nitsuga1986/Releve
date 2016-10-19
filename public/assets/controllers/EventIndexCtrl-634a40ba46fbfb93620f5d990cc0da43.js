angular.module("TurnosApp").controller("EventIndexCtrl",['$scope', '$location', 'ResourceEvent', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceEvent, $filter, NgTableParams, $timeout) {
	$scope.events = [];
	$scope.filter_join = true;
	$scope.filter_joinmultiple = true;
	$scope.filter_unjoin = true;
	$scope.filter_waitlist = true;
	$scope.filter_waitlistclear = true;
	$scope.filter_finish_signup = true;
	$scope.filter_pricing = true;
	ResourceEvent.index().$promise.then(function(data) {
		$scope.events = data;
		stopLoading();
	});
}]);















