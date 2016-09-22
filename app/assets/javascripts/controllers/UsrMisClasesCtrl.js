angular.module("TurnosApp").controller("UsrMisClasesCtrl",['$scope', '$location', 'ResourceClase', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', '$cacheFactory', function($scope, $location, ResourceClase, ResourceAlumno, $filter, NgTableParams, $timeout, $cacheFactory) {
	ResourceAlumno.current().$promise.then(function(data) {
		$scope.alumno = data;
		// ngTable
		function dateFormat(date) {date = date.split('-'); date = date[2]+' de '+monthNames[parseInt(date[1])-1]; return date;}
		td = new Date();
		var Api = ResourceClase;
		$scope.columns_claseJoin = columns_claseJoin;
		$scope.cant_visible_cols = $.grep(columns_claseJoin, function(e){ return e.visible == true; }).length+1;
		$scope.tableParams = new NgTableParams({
			page: claseJoinDefaultPage,         	// initial first page
			count: claseJoinDefaultCount,         	// initial count per page
			filter: claseJoinDefaultFilter, 		// initial filter
			group: claseJoinDefaultGrouping
		}, {
			total: 0,          			 			// length of data
			counts: claseJoinPageSizes,				// page size buttons
			groupBy: claseJoinDefaultGroupingBy,
			groupOptions: {isExpanded: true},
			getData: function(params) {
				// ajax request to api
				startLoading();
				return Api.history_usr().$promise.then(function(data) {
					angular.forEach(data, function(value, key) {
						data[key]["duracion"] = data[key]["duracion"]+' hs'
						data[key]["nc_instructor"] = value.instructor.nombre_completo;
						if(value.reemplazo!=undefined){data[key]["nc_reemplazo"] = value.reemplazo.nombre_completo};
						data[key]["cant_users"] = value.users.length+" / "+value.max_users;
						data[key]["fecha_fixed"] = dateFormat(value.fecha) ;
						data[key]["dia"] = dayNames[(new Date(value.fecha+'T12:00:00Z')).getDay()];
					});
					data,$scope.alumno = $scope.condicionesClases(data,$scope.alumno);
					params.total(data.inlineCount);
					$scope.clases = data;
					stopLoading();
					return data;
				});
			}
		});
	});
	// eventModal
	$scope.eventModal = function(clase_id) {
		$scope.clase = $.grep($scope.clases, function(e){ return e.id == clase_id; })[0];
		$('#events-modal').modal('show');
	};
	// Join
	$scope.JoinUser = function() {
		$scope.got_to_url_success("/app/mis_clases");
		$cacheFactory.get('$http').remove("/api/clases/index_usr");
		startLoading();
		ResourceClase.join($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$scope.tableParams.reload();
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscrpción exitosa! </strong> Ya hemos guardado tu lugar en la clase, te esperamos!</div>').slideDown();
			stopLoading();
		});
	};
	// Unjoin
	$scope.UnJoinUser = function() {
		$scope.got_to_url_success("/app/mis_clases");
		$cacheFactory.get('$http').remove("/api/clases/history_usr");
		startLoading();
		ResourceClase.unjoin($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$scope.tableParams.reload();
			$('#alert-container').hide().html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-times" aria-hidden="true"></i> Clase cancelada! </strong> Ya hemos cancelado tu inscripción a la clase. Gracias por avisar!</div>').slideDown();
			stopLoading();
		});
	};
}]);
