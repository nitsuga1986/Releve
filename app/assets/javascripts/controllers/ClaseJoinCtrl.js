angular.module("TurnosApp").controller("ClaseJoinCtrl",['$scope', '$location', 'ResourceClase', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceClase, ResourceAlumno, $filter, NgTableParams, $timeout) {
	$scope.alumno = ResourceAlumno.current();
	$scope.alumno.actividad_counter = []; // Count clases for each actividad
	// ngTable
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
	td = new Date();
	var Api = ResourceClase;
	$scope.columns_claseJoin = columns_claseJoin;
	$scope.cant_visible_cols = $.grep(columns_claseJoin, function(e){ return e.visible == true; }).length+1;
    $scope.tableParams = new NgTableParams({
		page: claseJoinDefaultPage,         	// initial first page
		count: claseJoinDefaultCount,         	// initial count per page
		filter: claseJoinDefaultFilter, 		// initial filter
		sorting: claseJoinDefaultSorting, 		// initial sorting
		group: claseJoinDefaultGrouping
	}, {
		total: 0,           // length of data
		groupBy: claseJoinDefaultGroupingBy,
		groupOptions: {isExpanded: true},
		getData: function(params) {
			// ajax request to api
			startLoading();
			return Api.index_usr(params.url()).$promise.then(function(data) {
				angular.forEach(data, function(value, key) {
					data[key]["duracion"] = data[key]["duracion"]+' hs'
					data[key]["instructor_nombre_completo"] = value.instructor.nombre_completo;
					data[key]["cant_users"] = value.users.length+" / "+value.max_users;
					data[key]["fecha_fixed"] = dateFormat(value.fecha) ;
					data[key]["dia"] = dayNames[(new Date(value.fecha+'T12:00:00Z')).getDay()];
				});
				data = $scope.condicionesClases(data);
				$scope.clases = data;
				var filteredData = params.filter() ?
				$filter('filter')(data, params.filter()) : data;
				var orderedData = params.sorting() ?
				$filter('orderBy')(filteredData, params.orderBy()) : data;
				params.total(data.inlineCount);
				$scope.loading=false;
				stopLoading();
				return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
			});
		}
    });
	// condicionesClases
	$scope.condicionesClases = function(clases) {
		// Each clase:
		$.each(clases, function(index_clase, clase) {
			// completa?
			if(clase.users.length >= clase.max_users){	clases[index_clase].completa = true;
			} else {									clases[index_clase].completa = false;}
			// joined?
			if(jQuery.isEmptyObject( $.grep(clase.users, function(e){ return e.id == $scope.alumno.id; }))){	clases[index_clase].joined = false;
			}else{																								clases[index_clase].joined = true;}
			// actividad_counter []
			pack = $.grep($scope.alumno.packs, function(e){ return e.actividad_id == events[index_clase].actividad_id; })[0];
			if(pack!=undefined){
				if(pack.noperiod){
					if ($scope.alumno.actividad_counter[clases[index_clase].actividad_id] == undefined){	$scope.alumno.actividad_counter[clases[index_clase].actividad_id] = 1;
					}else{																					$scope.alumno.actividad_counter[clases[index_clase].actividad_id] += 1;}
				}else{
					sd = new Date(pack.fecha_start+'T12:00:00Z');
					ed = new Date(pack.fecha_end+'T12:00:00Z');
					cd = new Date(events[key_event].fecha+'T12:00:00Z');
					if(cd>sd && ed>cd){
						if ($scope.alumno.actividad_counter[events[key_event].actividad_id] == undefined){	$scope.alumno.actividad_counter[events[key_event].actividad_id] = 1;
					}else{																					$scope.alumno.actividad_counter[events[key_event].actividad_id] += 1;}}
				}
			}
			// old_clase? cancelable?
			dc = new Date(clase.fecha+" "+clase.horario);
			if(dc>td){
				if( td > new Date(dc.getTime() - (24 * 60 * 60 * 1000))) {	clases[index_clase].cancelable = false;
				}else{														clases[index_clase].cancelable = true;}
																			clases[index_clase].old_clase = false;
			} else {														clases[index_clase].old_clase = true;}
		});
		return clases
	};
	// eventModal
	$scope.eventModal = function(clase_id) {
		$scope.clase = $.grep($scope.clases, function(e){ return e.id == clase_id; })[0];
		$('#events-modal').modal('show');
	};
	// Join
	$scope.JoinUser = function() {
		startLoading();
		ResourceClase.join($scope.clase, success, failure).$promise.then(function(data) {
			$scope.tableParams.reload();
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscrpción exitosa! </strong> Ya hemos guardado tu lugar en la clase, te esperamos!</div>').slideDown();
			stopLoading();
		});
	};
	// Unjoin
	$scope.UnJoinUser = function() {
		startLoading();
		ResourceClase.unjoin($scope.clase, success, failure).$promise.then(function(data) {
			$scope.tableParams.reload();
			$('#alert-container').hide().html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-times" aria-hidden="true"></i> Clase cancelada! </strong> Ya hemos cancelado tu inscripción a la clase. Gracias por avisar!</div>').slideDown();
			stopLoading();
		});
	};
	// Callback Success
	function success(response) {
		console.log("success", response);
		$location.path("/dashboard/join");
	}
	// Callback Failure
	function failure(response) {
		$scope.submiterror = true;
		window.scrollTo(0, 0);
		console.log("failure", response)
		_.each(response.data, function(errors, key) {
			_.each(errors, function(e) {
				$scope.form[key].$dirty = true;
				$scope.form[key].$setValidity(e, false);
			});
		});
	}
}]);
