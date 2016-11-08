angular.module("TurnosApp").controller("ActividadIndexCtrl",['$scope', '$rootScope', '$location', 'ResourceActividad', '$filter','NgTableParams', '$timeout', function($scope, $rootScope, $location, ResourceActividad, $filter, NgTableParams, $timeout) {
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
				$scope.actividades = data;
				// Filter & Sort
				filteredData = params.filter() ? $filter('filter')(data, params.filter()): data;	
				orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				// Show
				params.total(orderedData.inlineCount);
				stopLoading();
				return orderedData;
			});
		}
    });
	// Reload button
	$scope.reloadTable = function(id) {
		$scope.tableParams.reload();
	};
	// Destroy
	$scope.toDestroy = function(actividad_id) {
		console.log(actividad_id)
		$scope.IdToDestroy = actividad_id;
	};
	$scope.destroyActividad = function() {
		$rootScope.got_to_url_success = "/actividad/index";
		console.log('destroy')
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$.each($scope.actividades, function(index) {
				if($scope.actividades[index]!=undefined && $scope.actividades[index].id == $scope.IdToDestroy) { //Remove from array
					ResourceActividad.destroy($scope.actividades[index], $scope.callbackSuccess, $scope.callbackFailure);
					$scope.tableParams.reload();
				}
			});
		})
	};
	
}]);















