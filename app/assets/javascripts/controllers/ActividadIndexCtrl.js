angular.module("TurnosApp").controller("ActividadIndexCtrl",['$scope', '$location', 'ResourceActividad', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceActividad, $filter, NgTableParams, $timeout) {
	//	$scope.practicantes = ResourcePracticante.index();
	$scope.GoToEdit = function(id) {$location.path("/actividad/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/actividad/new");};
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
			startLoading();
			return Api.index().$promise.then(function(data) {
				params.total(data.inlineCount);
				$scope.actividades = data;
				stopLoading();
				return data;
			});
		}
    });
	// Reload button
	$scope.reloadTable = function(id) {
		$scope.tableParams.reload();
	};
}]);















