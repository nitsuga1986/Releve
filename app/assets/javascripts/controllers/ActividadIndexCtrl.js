angular.module("TurnosApp").controller("ActividadIndexCtrl",['$scope', '$cacheFactory', '$location', 'ResourceActividad', '$filter','ngTableParams', '$timeout', function($scope, $cacheFactory, $location, ResourceActividad, $filter, ngTableParams, $timeout) {
	//	$scope.practicantes = ResourcePracticante.index();
	$scope.GoToEdit = function(id) {$location.path("/dashboard/actividad/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/dashboard/actividad/new");};
	// ngTable
	var Api = ResourceActividad;
	$scope.columns_actividad = columns_actividad
	$scope.tableParams = new ngTableParams({
		page: actividadDefaultPage,         		// initial first page
		count: actividadDefaultCount,        	// initial count per page
		filter: actividadDefaultFilter, 			// initial filter
		sorting: actividadDefaultSorting 		// initial sorting
	}, {
		total: 0,           // length of data
		getData: function($defer, params) {
			// ajax request to api
			$scope.loading=true;
			Api.index({}, function(data) {
				// update table params
				params.total(data.length);
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
		$cacheFactory.get('$http').remove("/dashboard/actividad");
		$scope.tableParams.reload();
	};
}]);















