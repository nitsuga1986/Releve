angular.module("TurnosApp").controller("ClaseIndexCtrl",['$scope', '$cacheFactory', '$location', 'ResourceClase', '$filter','ngTableParams', '$timeout', function($scope, $cacheFactory, $location, ResourceClase, $filter, ngTableParams, $timeout) {
	//	$scope.users = ResourceUser.index();
	$scope.GoToShow = function(id) {$location.path("/clase/"+id);};
	$scope.GoToNew = function() {$location.path("/clase/new");};
	// ngTable
	var Api = ResourceClase;
	$scope.columns_clase = columns_clase
	$scope.tableParams = new ngTableParams({
		page: claseDefaultPage,         	// initial first page
		count: claseDefaultCount,         	// initial count per page
		filter: claseDefaultFilter, 		// initial filter
		sorting: claseDefaultSorting 		// initial sorting
	}, {
		total: 0,           // length of data
		getData: function($defer, params) {
			// ajax request to api
			$scope.loading=true;
			Api.index({}, function(data) {
				// update table params
				params.total(data.length);
				angular.forEach(data, function(value, key) {data[key]["cantidad"] =value.users.length;});
				var filteredData = params.filter() ?
				$filter('filter')(data, params.filter()) : data;
				var orderedData = params.sorting() ?
				$filter('orderBy')(filteredData, params.orderBy()) : data;
				$scope.tableResults = '('+data.length+')';
				$scope.loading=false;
				// set new data
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			});
		}
	});
	// Reload button
	$scope.reloadTable = function(id) {
		$cacheFactory.get('$http').remove("/api/clase");
		$scope.tableParams.reload();
	};
}]);















