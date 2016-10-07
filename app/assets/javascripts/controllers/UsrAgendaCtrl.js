angular.module("TurnosApp").controller("UsrAgendaCtrl",['$scope', '$rootScope', '$location', 'ResourceClase', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', '$cacheFactory', function($scope, $rootScope, $location, ResourceClase, ResourceAlumno, $filter, NgTableParams, $timeout, $cacheFactory) {
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
		$scope.columns_claseAgenda = columns_claseAgenda;
		$scope.cant_visible_cols = $.grep(columns_claseAgenda, function(e){ return e.visible == true; }).length+1;
		$scope.tableParams = new NgTableParams({
			page: claseAgendaDefaultPage,         	// initial first page
			count: claseAgendaDefaultCount,         // initial count per page
			filter: claseAgendaDefaultFilter, 		// initial filter
			sorting: claseAgendaDefaultSorting,		// initial sorting
			group: claseAgendaDefaultGrouping		// initial grouping
		}, {
			total: 0,          			 			// length of data
			counts: claseAgendaPageSizes,			// page size buttons
			groupBy: claseAgendaDefaultGroupingBy,
			groupOptions: {isExpanded: true},
			getData: function(params) {
				// ajax request to api
				startLoading();
				return Api.index_usr().$promise.then(function(data) {
					angular.forEach(data, function(value, key) {
						if($scope.clases!=undefined && $scope.clases[key]['checked'] == true){data[key]['checked'] = true}
						else{data[key]['checked'] = false};
						data[key]["duracion"] = data[key]["duracion"]+' hs'
						data[key]["cant_users"] = value.users.length+" / "+value.max_users;
						data[key]["fecha_fixed"] = dateFormat(value.fecha) ;
					});
					data,$scope.alumno = $scope.condicionesClases(data,$scope.alumno);
					$scope.clases = data;
					// Filter & Sort
					if($scope.filterDay.every(function(element,index){return element===[false,false,false,false,false,false,false][index];})){data=[];}
					dayData = jQuery.grep(data,function(clase){return $scope.dayCriteria.indexOf(clase.dia) !== -1;});
					filteredData = params.filter() ? $filter('filter')(dayData, params.filter()): dayData;	
					orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : data;
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
				if($scope.alumno.actividad_counter[clase.actividad_id]==undefined){$scope.alumno.actividad_counter[clase.actividad_id]=[];}
				if($scope.alumno.actividad_counter[clase.actividad_id][clase.mes]==undefined){$scope.alumno.actividad_counter[clase.actividad_id][clase.mes]=0;}
				if($scope.alumno.selected_counter[clase.actividad_id]==undefined){$scope.alumno.selected_counter[clase.actividad_id]=[];}
				if($scope.alumno.selected_counter[clase.actividad_id][clase.mes]==undefined){$scope.alumno.selected_counter[clase.actividad_id][clase.mes]=0;}
				if(pack.cantidad > ($scope.alumno.actividad_counter[clase.actividad_id][clase.mes]+$scope.alumno.selected_counter[clase.actividad_id][clase.mes])){
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
			$rootScope.got_to_url_success = "/app/agenda";
			$cacheFactory.get('$http').remove("/api/clases/index_usr");
			ResourceClase.join_multiple($scope.selectedclases, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
				$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscripción exitosa! </strong> Ya te agendamos para las clases seleccionadas, te esperamos!</div>').slideDown();
				$scope.tableParams.reload();
			});
		}
	};
	// Join
	$scope.JoinUser = function() {
		startLoading();
		$rootScope.got_to_url_success = "/app/agenda";
		$cacheFactory.get('$http').remove("/api/clases/index_usr");
		ResourceClase.join($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscripción exitosa! </strong> Ya hemos guardado tu lugar en la clase, te esperamos!</div>').slideDown();
			$scope.tableParams.reload();
		});
	};
	// Unjoin
	$scope.UnJoinUser = function() {
		startLoading();
		$rootScope.got_to_url_success = "/app/agenda";
		$cacheFactory.get('$http').remove("/api/clases/index_usr");
		ResourceClase.unjoin($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$('#alert-container').hide().html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-times" aria-hidden="true"></i> Clase cancelada! </strong> Ya hemos cancelado tu inscripción a la clase. Gracias por avisar!</div>').slideDown();
			$scope.tableParams.reload();
		});
	};
	// WaitListUser
	$scope.WaitListUser = function() {
		startLoading();
		$rootScope.got_to_url_success = "/app/agenda";
		$cacheFactory.get('$http').remove("/api/clases/index_usr");
		ResourceClase.waitlist($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Lista actualizada! </strong> Ya te hemos agregado a la lista de espera.</div>').slideDown();
			$scope.tableParams.reload();
		});
	};
	// filterDay
	var allTrueArray=[true,true,true,true,true,true,true];
	var allFalseArray=[false,false,false,false,false,false,false];
	
	$scope.dayCriteria = dayNames;
	$scope.filterDay=allTrueArray.slice(0);
	$scope.filterAll=true;
	filterDaychangeAllClass = function() {
		if($scope.filterDay.every(function(element,index){return element===allTrueArray[index];})){
				$( "button.changeAll > i" ).removeClass('fa-square-o').addClass('fa-square'); return true
		}else{	$( "button.changeAll > i" ).removeClass('fa-square').addClass('fa-square-o');return false
	}};
	changeDayCriteria = function() {
		dayCriteria=[]; 
		angular.forEach(dayNames,function(value,key){
			if($scope.filterDay[key]){
				dayCriteria.push(dayNames[key])
			}
			$scope.dayCriteria=dayCriteria;
		});
		$scope.tableParams.page(1);
	};
	$scope.filterDaychangeAll = function() {
		startLoading();
		if(filterDaychangeAllClass()){$scope.filterDay=allFalseArray.slice(0);}
		else{$scope.filterDay=allTrueArray.slice(0);};
		changeDayCriteria();
		filterDaychangeAllClass();
		$scope.tableParams.reload();
	};
	$scope.filterDaychange = function(day) {
		startLoading();
		if($scope.filterDay.every(function(element,index){return element===allTrueArray[index];})){$scope.filterDay=allFalseArray.slice(0);}
		$scope.filterDay[day] = !$scope.filterDay[day];
		changeDayCriteria();
		filterDaychangeAllClass();
		$('button.filterDayButton').blur();
		$scope.tableParams.reload();
	};
}]);
