angular.module("TurnosApp").controller("UsrMisClasesCtrl",['$scope', '$rootScope', '$location', 'ResourceClase', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', '$cacheFactory', function($scope, $rootScope, $location, ResourceClase, ResourceAlumno, $filter, NgTableParams, $timeout, $cacheFactory) {
	ResourceAlumno.current().$promise.then(function(data) {
		$scope.alumno = data;
		// ngTable
		function dateFormat(date) {date = date.split('-'); date = date[2]+' de '+monthNames[parseInt(date[1])-1]; return date;}
		td = new Date();
		var Api = ResourceClase;
		$scope.columns_claseMisClases = columns_claseMisClases;
		$scope.cant_visible_cols = $.grep(columns_claseMisClases, function(e){ return e.visible == true; }).length+1;
		$scope.tableParams = new NgTableParams({
			page: claseMisClasesDefaultPage,         	// initial first page
			count: claseMisClasesDefaultCount,         	// initial count per page
			filter: claseMisClasesDefaultFilter, 		// initial filter
			sorting: claseMisClasesDefaultSorting,		// initial sorting
		}, {
			total: 0,          			 			// length of data
			counts: claseMisClasesPageSizes,				// page size buttons
			getData: function(params) {
				// ajax request to api
				startLoading();
				return Api.history_usr().$promise.then(function(data) {
					angular.forEach(data, function(value, key) {
						data[key]["duracion"] = data[key]["duracion"]+' hs'
						data[key]["horario"] = data[key]["horario"]+' hs'
						data[key]["fecha_fixed"] = value.dia+' '+dateFormat(value.fecha) ;
					});
					data,$scope.alumno = $scope.condicionesClases(data,$scope.alumno);
					$scope.clases = data;
					// Filter & Sort
					orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
					// Show
					params.total(orderedData.inlineCount);
					stopLoading();
					return orderedData;
				});
			}
		});
	});
	// eventModal
	$scope.eventModal = function(clase_id) {
		$scope.clase = $.grep($scope.clases, function(e){ return e.id == clase_id; })[0];
		$('#events-modal').modal('show');
	};
	// Unjoin
	$scope.UnJoinUser = function() {
		startLoading();
		$rootScope.got_to_url_success = "/app/mis_clases";
		$cacheFactory.get('$http').remove("/api/clases/history_usr");
		ResourceClase.unjoin($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$('#alert-container').hide().html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-times" aria-hidden="true"></i> Clase cancelada! </strong> Ya hemos cancelado tu inscripción a la clase. Gracias por avisar!</div>').slideDown();
			$scope.tableParams.reload();
		});
	};
}]);
