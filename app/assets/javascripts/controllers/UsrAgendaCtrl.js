angular.module("TurnosApp").controller("UsrAgendaCtrl",['$scope', '$location', 'ResourceClase', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', '$cacheFactory', function($scope, $location, ResourceClase, ResourceAlumno, $filter, NgTableParams, $timeout, $cacheFactory) {
	ResourceAlumno.current().$promise.then(function(data) {
		$scope.alumno = data;
		$scope.selectmultiple = false;
		if ($scope.alumno.primera_clase){if($scope.alumno.confirmed){$('#first-clase-modal').modal('show')}};
		// ngTable
		function dateFormat(date) {date = date.split('-'); date = date[2]+' de '+monthNames[parseInt(date[1])-1]; return date;}
		// changeselection
		$scope.changeselection = function() {
				$scope.selectmultiple = !$scope.selectmultiple;
		};	
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
				return Api.index_usr().$promise.then(function(data) {
					angular.forEach(data, function(value, key) {
						data[key]['checked'] = false;
						data[key]["duracion"] = data[key]["duracion"]+' hs'
						data[key]["nc_instructor"] = value.instructor.nombre_completo;
						if(value.reemplazo!=undefined){data[key]["nc_reemplazo"] = value.reemplazo.nombre_completo};
						data[key]["cant_users"] = value.users.length+" / "+value.max_users;
						data[key]["fecha_fixed"] = dateFormat(value.fecha) ;
						data[key]["dia"] = dayNames[(new Date(value.fecha+'T12:00:00Z')).getDay()];
					});
					data,$scope.alumno = $scope.condicionesClases(data,$scope.alumno);
					$scope.clases = data;
					filteredData = params.filter() ? $filter('filter')(data, params.filter()): data;	
					params.total(filteredData.inlineCount);
					stopLoading();
					return filteredData;
				});
			}
		});
	});
	// eventModal
	$scope.eventModal = function(clase_id) {
		$scope.clase = $.grep($scope.clases, function(e){ return e.id == clase_id; })[0];
		$('#events-modal').modal('show');
	};
	// multipleEventModal
	$scope.multipleEventModal = function(clase_id) {
		$scope.selectedclases = $.grep($scope.clases, function(e){ return e.checked == true; });
		$('#multiple-events-modal').modal('show');
	};
	// verifyPlan
	$scope.verifyPlan = function(state,clase_id) {
		function preventClase(index_clase) {
			$scope.clases[index_clase].checked=false;
			$('#alert-modal').modal('show');
		}
		var clase = {}; var index_clase=0;
		$.each($scope.clases, function(index, each_clase) {if(each_clase.id == clase_id){clase = each_clase;index_clase = index;return false;}});
		pack = $.grep($scope.alumno.packs, function(e){ return e.actividad_id == clase.actividad_id; })[0];
		if (state){
			if (pack != undefined){
				if($scope.alumno.actividad_counter[clase.actividad_id]==undefined){$scope.alumno.actividad_counter[clase.actividad_id]=0;}
				if($scope.alumno.selected_counter[clase.actividad_id]==undefined){$scope.alumno.selected_counter[clase.actividad_id]=0;}
				if(pack.cantidad > ($scope.alumno.actividad_counter[clase.actividad_id]+$scope.alumno.selected_counter[clase.actividad_id])){
					$scope.alumno.selected_counter[clase.actividad_id] += 1;
				}else{preventClase(index_clase);}
			}else{preventClase(index_clase);}
		}else{$scope.alumno.selected_counter[clase.actividad_id] -= 1;}
	};
	// JoinMultiple
	$scope.JoinMultiple = function() {
		$scope.got_to_url_success("/app/agenda");
		angular.forEach($cacheFactory.info(), function(ob, key) {
		   console.log($cacheFactory);
		   console.log($cacheFactory.get(key));
		});
		$cacheFactory.get('$http').remove("/api/clases/index_usr");
		startLoading();
		ResourceClase.join_multiple($scope.selectedclases, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$scope.tableParams.reload();
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscrpción exitosa! </strong> Ya te agendamos para las clases seleccionadas, te esperamos!</div>').slideDown();
			stopLoading();
		});
	};
	// Join
	$scope.JoinUser = function() {
		$scope.got_to_url_success("/app/agenda");
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
		$scope.got_to_url_success("/app/agenda");
		$cacheFactory.get('$http').remove("/api/clases/index_usr");
		startLoading();
		ResourceClase.unjoin($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$scope.tableParams.reload();
			$('#alert-container').hide().html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-times" aria-hidden="true"></i> Clase cancelada! </strong> Ya hemos cancelado tu inscripción a la clase. Gracias por avisar!</div>').slideDown();
			stopLoading();
		});
	};
	// WaitListUser
	$scope.WaitListUser = function() {
		$scope.got_to_url_success("/app/agenda");
		$cacheFactory.get('$http').remove("/api/clases/index_usr");
		startLoading();
		ResourceClase.waitlist($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$scope.tableParams.reload();
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Lista actualizada! </strong> Ya te hemos agregado a la lista de espera.</div>').slideDown();
			stopLoading();
		});
	};
	// filterDay
	$scope.filterDay=[true,true,true,true,true,true,true]
	$scope.filterDaychange = function(day) {
		$scope.filterDay[day] = !$scope.filterDay[day];
		
	};
}]);
