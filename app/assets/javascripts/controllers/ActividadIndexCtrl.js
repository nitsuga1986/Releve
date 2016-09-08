angular.module("TurnosApp").controller("ActividadIndexCtrl",['$scope', '$cacheFactory', '$location', 'ResourceActividad', '$filter','NgTableParams', '$timeout', function($scope, $cacheFactory, $location, ResourceActividad, $filter, NgTableParams, $timeout) {
	//	$scope.practicantes = ResourcePracticante.index();
	$scope.GoToEdit = function(id) {$location.path("/dashboard/actividad/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/dashboard/actividad/new");};
	// ngTable
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
	var Api = ResourceActividad;
	$scope.columns_actividad = columns_actividad
	$scope.cant_visible_cols = $.grep(columns_actividad, function(e){ return e.visible == true; }).length+1;
    $scope.tableParams = new NgTableParams({
		page: actividadDefaultPage,         	// initial first page
		count: actividadDefaultCount,         	// initial count per page
		sorting: actividadDefaultSorting 		// initial sorting
	}, {
		total: 0,           // length of data
		getData: function(params) {
			// ajax request to api
			return Api.index(params.url()).$promise.then(function(data) {
				$scope.actividades = data;
				var orderedData = params.sorting() ?
				$filter('orderBy')(data, params.orderBy()) : data;
				params.total(orderedData.inlineCount);
				$scope.loading=false;
				return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
			});
		}
    });
	// Reload button
	$scope.reloadTable = function(id) {
		$cacheFactory.get('$http').remove("/dashboard/actividad");
		$scope.tableParams.reload();
	};
}]);















