angular.module("TurnosApp").controller("EventIndexCtrl",['$scope', '$location', 'ResourceEvent', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceEvent, $filter, NgTableParams, $timeout) {
	$scope.events = [];
	$scope.filter_modificaciones = true;
	$scope.filter_payment = true;
	$scope.filter_others = true;
	$scope.filter_all = true;
	ResourceEvent.index().$promise.then(function(data) {
		$scope.events = data;
		stopLoading();
	});

	// changeFilter
	$scope.changeFilter = function(filter) {
		switch (filter) {
			case 'all':
				$scope.filter_all = true;
				$scope.filter_modificaciones = true;
				$scope.filter_payment = true;
				$scope.filter_others = true;
				break;
			case 'modificaciones':
				$scope.filter_all = false;
				$scope.filter_modificaciones = true;
				$scope.filter_payment = false;
				$scope.filter_others = false;
				break;
			case 'payment':
				$scope.filter_all = false;
				$scope.filter_modificaciones = false;
				$scope.filter_payment = true;
				$scope.filter_others = false;
				break;
			case 'others':
				$scope.filter_all = false;
				$scope.filter_modificaciones = false;
				$scope.filter_payment = false;
				$scope.filter_others = true;
				break;
		} 
	};
	
}]);















