angular.module("TurnosApp").controller("ClaseModificacionesCtrl",['$scope', '$rootScope', '$location', 'ResourceClase', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', '$cacheFactory', function($scope, $rootScope, $location, ResourceClase, ResourceAlumno, $filter, NgTableParams, $timeout, $cacheFactory) {
	function dateFormat(date) {date = date.split('-'); date = date[2]+' de '+monthNames[parseInt(date[1])-1]; return date;}
	$scope.agendar_selected = true;
	$scope.columns_agendar = columns_agendar;
	$scope.cant_visible_cols = $.grep(columns_agendar, function(e){ return e.visible == true; }).length+1;
	
	// SUBMIT: Buscar clases
	$scope.submit = function() {
		if ($scope.alumno!=undefined){
			$rootScope.got_to_url_success = "/clase/dashboard";
			$scope.FormErrors = [];
			$scope.tableParams = new NgTableParams({
			}, {
				counts: [],							// hides page sizes
				getData: function(params) {
					// ajax request to api
					startLoading();
					if($scope.agendar_selected){ Resource = ResourceClase.index_current();
					}else{ Resource = ResourceClase.index_user({ id: $scope.alumno.id });}
					return Resource.$promise.then(function(data) {
						dataFilteredByDay = [];
						data,$scope.alumno = $scope.condicionesClases(data,$scope.alumno);
						angular.forEach(data, function(value, key) {
							data[key]["duracion"] = data[key]["duracion"]+' hs'
							data[key]["cant_users"] = value.users.length+" / "+value.max_users;
							data[key]["fecha_fixed"] = value.dia+" "+dateFormat(value.fecha)+" "+value.horario+"hs";
							if($scope.agendar_selected){
								if(!value.old&&(
									($scope.filterDay[0]&&value.dia=='Lunes'&&value.horario=='09:00')||($scope.filterDay[1]&&value.dia=='Lunes'&&value.horario=='10:00')||($scope.filterDay[2]&&value.dia=='Lunes'&&value.horario=='11:00')||($scope.filterDay[3]&&value.dia=='Lunes'&&value.horario=='12:00')||($scope.filterDay[4]&&value.dia=='Lunes'&&value.horario=='13:00')||($scope.filterDay[5]&&value.dia=='Lunes'&&value.horario=='14:00')||($scope.filterDay[6]&&value.dia=='Lunes'&&value.horario=='15:00')||($scope.filterDay[7]&&value.dia=='Lunes'&&value.horario=='16:00')||($scope.filterDay[8]&&value.dia=='Lunes'&&value.horario=='17:00')||($scope.filterDay[9]&&value.dia=='Lunes'&&value.horario=='18:00')||($scope.filterDay[10]&&value.dia=='Lunes'&&value.horario=='19:00')||($scope.filterDay[11]&&value.dia=='Lunes'&&value.horario=='20:00')||
									($scope.filterDay[12]&&value.dia=='Martes'&&value.horario=='09:00')||($scope.filterDay[13]&&value.dia=='Martes'&&value.horario=='10:00')||($scope.filterDay[14]&&value.dia=='Martes'&&value.horario=='11:00')||($scope.filterDay[15]&&value.dia=='Martes'&&value.horario=='12:00')||($scope.filterDay[16]&&value.dia=='Martes'&&value.horario=='13:00')||($scope.filterDay[17]&&value.dia=='Martes'&&value.horario=='14:00')||($scope.filterDay[18]&&value.dia=='Martes'&&value.horario=='15:00')||($scope.filterDay[19]&&value.dia=='Martes'&&value.horario=='16:00')||($scope.filterDay[20]&&value.dia=='Martes'&&value.horario=='17:00')||($scope.filterDay[21]&&value.dia=='Martes'&&value.horario=='18:00')||($scope.filterDay[22]&&value.dia=='Martes'&&value.horario=='19:00')||($scope.filterDay[23]&&value.dia=='Martes'&&value.horario=='20:00')||
									($scope.filterDay[24]&&value.dia=='Miércoles'&&value.horario=='09:00')||($scope.filterDay[25]&&value.dia=='Miércoles'&&value.horario=='10:00')||($scope.filterDay[26]&&value.dia=='Miércoles'&&value.horario=='11:00')||($scope.filterDay[27]&&value.dia=='Miércoles'&&value.horario=='12:00')||($scope.filterDay[28]&&value.dia=='Miércoles'&&value.horario=='13:00')||($scope.filterDay[29]&&value.dia=='Miércoles'&&value.horario=='14:00')||($scope.filterDay[30]&&value.dia=='Miércoles'&&value.horario=='15:00')||($scope.filterDay[31]&&value.dia=='Miércoles'&&value.horario=='16:00')||($scope.filterDay[32]&&value.dia=='Miércoles'&&value.horario=='17:00')||($scope.filterDay[33]&&value.dia=='Miércoles'&&value.horario=='18:00')||($scope.filterDay[34]&&value.dia=='Miércoles'&&value.horario=='19:00')||($scope.filterDay[35]&&value.dia=='Miércoles'&&value.horario=='20:00')||
									($scope.filterDay[36]&&value.dia=='Jueves'&&value.horario=='09:00')||($scope.filterDay[37]&&value.dia=='Jueves'&&value.horario=='10:00')||($scope.filterDay[38]&&value.dia=='Jueves'&&value.horario=='11:00')||($scope.filterDay[39]&&value.dia=='Jueves'&&value.horario=='12:00')||($scope.filterDay[40]&&value.dia=='Jueves'&&value.horario=='13:00')||($scope.filterDay[41]&&value.dia=='Jueves'&&value.horario=='14:00')||($scope.filterDay[42]&&value.dia=='Jueves'&&value.horario=='15:00')||($scope.filterDay[43]&&value.dia=='Jueves'&&value.horario=='16:00')||($scope.filterDay[44]&&value.dia=='Jueves'&&value.horario=='17:00')||($scope.filterDay[45]&&value.dia=='Jueves'&&value.horario=='18:00')||($scope.filterDay[46]&&value.dia=='Jueves'&&value.horario=='19:00')||($scope.filterDay[47]&&value.dia=='Jueves'&&value.horario=='20:00')||
									($scope.filterDay[48]&&value.dia=='Viernes'&&value.horario=='09:00')||($scope.filterDay[49]&&value.dia=='Viernes'&&value.horario=='10:00')||($scope.filterDay[50]&&value.dia=='Viernes'&&value.horario=='11:00')||($scope.filterDay[51]&&value.dia=='Viernes'&&value.horario=='12:00')||($scope.filterDay[52]&&value.dia=='Viernes'&&value.horario=='13:00')||($scope.filterDay[53]&&value.dia=='Viernes'&&value.horario=='14:00')||($scope.filterDay[54]&&value.dia=='Viernes'&&value.horario=='15:00')||($scope.filterDay[55]&&value.dia=='Viernes'&&value.horario=='16:00')||($scope.filterDay[56]&&value.dia=='Viernes'&&value.horario=='17:00')||($scope.filterDay[57]&&value.dia=='Viernes'&&value.horario=='18:00')||($scope.filterDay[58]&&value.dia=='Viernes'&&value.horario=='19:00')||($scope.filterDay[59]&&value.dia=='Viernes'&&value.horario=='20:00')
								)){
									if(value.cancelada || value.completa){data[key]['checked'] = false;}
									else{data[key]['checked'] = true;}
									dataFilteredByDay.push(data[key]);
								}
							}else{	dataFilteredByDay = data;}
							$scope.clases = dataFilteredByDay;
						});
						
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
	// changesButton
	$scope.changesButton = function(agendar_bool) {
		$scope.agendar_selected = agendar_bool;
		delete $scope.clases;
		delete $scope.alumno;
	};
	// Autocomplete
	$(function() {
		$( "#search_user" ).autocomplete({
			source: '/api/alumnos/autocomplete',
			minLength: 2,
			select: function( event, ui ) {
				$('#form_search_user').removeClass('has-error');
				$scope.alumno = ResourceAlumno.show({ id: ui.item.id });
				$scope.$apply();
				$(this).val("");
				return false;
			}
		});
	});
	// JoinMultiple
	$scope.JoinMultiple = function() {
		if($scope.selectedclases.length){
			startLoading();
			$rootScope.got_to_url_success = "/clase/modificaciones";
			$scope.selectedclases[0]["alumno_id"] = $scope.alumno.id;
			ResourceClase.join_usr_multiple($scope.selectedclases, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
				$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscripción exitosa! </strong> Ya agendamos las clases seleccionadas!</div>').slideDown();
				delete $scope.clases;
				delete $scope.alumno;
				stopLoading();
			});
		}
	};
	// UnjoinMultiple
	$scope.UnjoinMultiple = function() {
		if($scope.selectedclases.length){
			startLoading();
			$rootScope.got_to_url_success = "/clase/modificaciones";
			$scope.selectedclases[0]["alumno_id"] = $scope.alumno.id;
			ResourceClase.unjoin_usr_multiple($scope.selectedclases, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
				$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Cancelación exitosa! </strong> Ya cancelamos las clases seleccionadas</div>').slideDown();
				delete $scope.clases;
				delete $scope.alumno;
				stopLoading();
			});
		}
	};
	// multipleEventModal
	$scope.multipleEventModal = function(clase_id) {
		$scope.selectedclases = $.grep($scope.clases, function(e){ return e.checked == true; });
		$('#multiple-events-modal').modal('show');
	};
stopLoading();}]);
