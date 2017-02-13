angular.module("TurnosApp").controller("UsrPlanificarCtrl",['$scope', '$rootScope', '$location', '$window', 'ResourceClase', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', '$cacheFactory', function($scope, $rootScope, $location, $window, ResourceClase, ResourceAlumno, $filter, NgTableParams, $timeout, $cacheFactory) {
	function dateFormat(date) {date = date.split('-'); date = date[2]+' de '+monthNames[parseInt(date[1])-1]; return date;}
	$scope.columns_clasePlanificar = columns_clasePlanificar;
	$scope.cant_visible_cols = $.grep(columns_clasePlanificar, function(e){ return e.visible == true; }).length+1;
	$scope.alumno = ResourceAlumno.current();
	// SUBMIT
	$scope.submit = function() {
		if(!$scope.changesUnsaved){	$scope.changesUnsaved=true;}
		if ($scope.alumno!=undefined){
			$rootScope.got_to_url_success = "/clase/instructor";
			$scope.FormErrors = [];
			$scope.tableParams = new NgTableParams({
			}, {
				counts: [],							// hides page sizes
				getData: function(params) {
					// ajax request to api
					startLoading();
					return ResourceClase.index_current().$promise.then(function(data) {
						dataFilteredByDay = [];
						data,$scope.alumno = $scope.condicionesClases(data,$scope.alumno);
						angular.forEach(data, function(value, key) {
							data[key]["duracion"] = data[key]["duracion"]+' hs'
							data[key]["cant_users"] = value.users.length+" / "+value.max_users;
							data[key]["fecha_fixed"] = value.dia+" "+dateFormat(value.fecha)+" "+value.horario+"hs";
							if(!value.old&&(
								($scope.filterDay[0]&&value.dia=='Lunes'&&value.horario=='09:00')||($scope.filterDay[1]&&value.dia=='Lunes'&&value.horario=='10:00')||($scope.filterDay[2]&&value.dia=='Lunes'&&value.horario=='11:00')||($scope.filterDay[3]&&value.dia=='Lunes'&&value.horario=='12:00')||($scope.filterDay[4]&&value.dia=='Lunes'&&value.horario=='13:00')||($scope.filterDay[5]&&value.dia=='Lunes'&&value.horario=='14:00')||($scope.filterDay[6]&&value.dia=='Lunes'&&value.horario=='15:00')||($scope.filterDay[7]&&value.dia=='Lunes'&&value.horario=='16:00')||($scope.filterDay[8]&&value.dia=='Lunes'&&value.horario=='17:00')||($scope.filterDay[9]&&value.dia=='Lunes'&&value.horario=='18:00')||($scope.filterDay[10]&&value.dia=='Lunes'&&value.horario=='19:00')||($scope.filterDay[11]&&value.dia=='Lunes'&&value.horario=='20:00')||
								($scope.filterDay[12]&&value.dia=='Martes'&&value.horario=='09:00')||($scope.filterDay[13]&&value.dia=='Martes'&&value.horario=='10:00')||($scope.filterDay[14]&&value.dia=='Martes'&&value.horario=='11:00')||($scope.filterDay[15]&&value.dia=='Martes'&&value.horario=='12:00')||($scope.filterDay[16]&&value.dia=='Martes'&&value.horario=='13:00')||($scope.filterDay[17]&&value.dia=='Martes'&&value.horario=='14:00')||($scope.filterDay[18]&&value.dia=='Martes'&&value.horario=='15:00')||($scope.filterDay[19]&&value.dia=='Martes'&&value.horario=='16:00')||($scope.filterDay[20]&&value.dia=='Martes'&&value.horario=='17:00')||($scope.filterDay[21]&&value.dia=='Martes'&&value.horario=='18:00')||($scope.filterDay[22]&&value.dia=='Martes'&&value.horario=='19:00')||($scope.filterDay[23]&&value.dia=='Martes'&&value.horario=='20:00')||
								($scope.filterDay[24]&&value.dia=='Miércoles'&&value.horario=='09:00')||($scope.filterDay[25]&&value.dia=='Miércoles'&&value.horario=='10:00')||($scope.filterDay[26]&&value.dia=='Miércoles'&&value.horario=='11:00')||($scope.filterDay[27]&&value.dia=='Miércoles'&&value.horario=='12:00')||($scope.filterDay[28]&&value.dia=='Miércoles'&&value.horario=='13:00')||($scope.filterDay[29]&&value.dia=='Miércoles'&&value.horario=='14:00')||($scope.filterDay[30]&&value.dia=='Miércoles'&&value.horario=='15:00')||($scope.filterDay[31]&&value.dia=='Miércoles'&&value.horario=='16:00')||($scope.filterDay[32]&&value.dia=='Miércoles'&&value.horario=='17:00')||($scope.filterDay[33]&&value.dia=='Miércoles'&&value.horario=='18:00')||($scope.filterDay[34]&&value.dia=='Miércoles'&&value.horario=='19:00')||($scope.filterDay[35]&&value.dia=='Miércoles'&&value.horario=='20:00')||
								($scope.filterDay[36]&&value.dia=='Jueves'&&value.horario=='09:00')||($scope.filterDay[37]&&value.dia=='Jueves'&&value.horario=='10:00')||($scope.filterDay[38]&&value.dia=='Jueves'&&value.horario=='11:00')||($scope.filterDay[39]&&value.dia=='Jueves'&&value.horario=='12:00')||($scope.filterDay[40]&&value.dia=='Jueves'&&value.horario=='13:00')||($scope.filterDay[41]&&value.dia=='Jueves'&&value.horario=='14:00')||($scope.filterDay[42]&&value.dia=='Jueves'&&value.horario=='15:00')||($scope.filterDay[43]&&value.dia=='Jueves'&&value.horario=='16:00')||($scope.filterDay[44]&&value.dia=='Jueves'&&value.horario=='17:00')||($scope.filterDay[45]&&value.dia=='Jueves'&&value.horario=='18:00')||($scope.filterDay[46]&&value.dia=='Jueves'&&value.horario=='19:00')||($scope.filterDay[47]&&value.dia=='Jueves'&&value.horario=='20:00')||
								($scope.filterDay[48]&&value.dia=='Viernes'&&value.horario=='09:00')||($scope.filterDay[49]&&value.dia=='Viernes'&&value.horario=='10:00')||($scope.filterDay[50]&&value.dia=='Viernes'&&value.horario=='11:00')||($scope.filterDay[51]&&value.dia=='Viernes'&&value.horario=='12:00')||($scope.filterDay[52]&&value.dia=='Viernes'&&value.horario=='13:00')||($scope.filterDay[53]&&value.dia=='Viernes'&&value.horario=='14:00')||($scope.filterDay[54]&&value.dia=='Viernes'&&value.horario=='15:00')||($scope.filterDay[55]&&value.dia=='Viernes'&&value.horario=='16:00')||($scope.filterDay[56]&&value.dia=='Viernes'&&value.horario=='17:00')||($scope.filterDay[57]&&value.dia=='Viernes'&&value.horario=='18:00')||($scope.filterDay[58]&&value.dia=='Viernes'&&value.horario=='19:00')||($scope.filterDay[59]&&value.dia=='Viernes'&&value.horario=='20:00')
							)){
								data[key]['checked'] = false;
								dataFilteredByDay.push(data[key]);
							}
						});
						$scope.clases = dataFilteredByDay;
						// Filter & Sort
						filteredData = params.filter() ? $filter('filter')(dataFilteredByDay, params.filter()): dataFilteredByDay;	
						orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
						// Show
						params.total(orderedData.inlineCount);
						stopLoading();
						return orderedData;
					});
				}
			});
		}else{$('#form_search_user').addClass('has-error');}
	};
	// filterDaychange
	$scope.filterDay = new Array(59).fill(false);
	$scope.filterDaychange = function(day,event) {
		event.preventDefault();
		$scope.filterDay[day] = !$scope.filterDay[day];
	};
	// checkboxShowFinished
	$scope.$on('checkboxShowFinished', function(ngRepeatFinishedEvent) {
		angular.forEach($scope.clases, function(clase, key) {
			if(!clase.cancelada && !clase.joined && !clase.completa){
				$scope.clases[key].checked=true;
				$scope.verifyPlan(true,clase.id,false);
			}
		})
	});
	// verifyPlan
	$scope.verifyPlan = function(state,clase_id) {
		$scope.changesUnsaved=true;
		$('#absoluteButtonAgendar').prop("disabled", false);
		function preventClase(index_clase) {
			$scope.clases[index_clase].checked=false;
			$('#alert-modal').modal('show');
		}
		var clase = {}; var index_clase=0;
		$.each($scope.clases, function(index, each_clase) {if(each_clase.id == clase_id){clase = each_clase;index_clase = index;return false;}});
		pack = $.grep($scope.alumno.packs, function(e){ return e.actividad_id == clase.actividad_id; })[0];
		if (state){
			if (pack != undefined){
				if(pack.cantidad_array != undefined && pack.cantidad_array[clase.mes-1] != undefined){maxClases = pack.cantidad_array[clase.mes-1];}else{ maxClases = 1;}
				if($scope.alumno.actividad_counter[clase.actividad_id]==undefined){$scope.alumno.actividad_counter[clase.actividad_id]=[];}
				if($scope.alumno.actividad_counter[clase.actividad_id][clase.mes]==undefined){$scope.alumno.actividad_counter[clase.actividad_id][clase.mes]=0;}
				if($scope.alumno.selected_counter[clase.actividad_id]==undefined){$scope.alumno.selected_counter[clase.actividad_id]=[];}
				if($scope.alumno.selected_counter[clase.actividad_id][clase.mes]==undefined){$scope.alumno.selected_counter[clase.actividad_id][clase.mes]=0;}
				if(maxClases > ($scope.alumno.actividad_counter[clase.actividad_id][clase.mes]+$scope.alumno.selected_counter[clase.actividad_id][clase.mes])){
					$scope.alumno.selected_counter[clase.actividad_id][clase.mes] += 1;
				}else{preventClase(index_clase);}
			}else{preventClase(index_clase);}
		}else{$scope.alumno.selected_counter[clase.actividad_id][clase.mes] -= 1;}
		$scope.alumno.selected_counter_total = 0;
		$.each($scope.alumno.selected_counter, function(index, arr) {if(arr!=undefined){$scope.alumno.selected_counter_total += arr.reduce(function(a, b) { return a + b; }, 0);}});
	};
	// JoinMultiple
	$scope.JoinMultiple = function() {
		if($scope.selectedclases.length){
			startLoading();
			$scope.clases = {};
			$rootScope.got_to_url_success = "/app/planificar";
			$cacheFactory.get('$http').remove("/api/clases/index_current");
			ResourceClase.join_multiple($scope.selectedclases, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
				$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscripción exitosa! </strong> Ya te agendamos para las clases seleccionadas, te esperamos!</div>').slideDown();
				$scope.tableParams.reload();
			});
		}
	};
	// multipleEventModal
	$scope.multipleEventModal = function(clase_id) {
		$scope.selectedclases = $.grep($scope.clases, function(e){ return e.checked == true; });
		$('#multiple-events-modal').modal('show');
	};
	// Confirmation Before Leave
	$scope.changesUnsaved=false;
	$scope.message = "Las clases seleccionadas no se han guardado ¿Seguro que desea salir?";
	var getMessage = function() {
		if($scope.changesUnsaved) {	return $scope.message;
		} else {					return null;
		}
	}
	$window.onbeforeunload = getMessage;
	var $offFunction = $rootScope.$on('$locationChangeStart', function(e) {
		var message = getMessage();
		if(message && !confirm($scope.message)) {	e.preventDefault();
		} else {									$offFunction();
		}
	});
	
stopLoading();}]);
