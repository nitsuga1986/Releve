angular.module("TurnosApp").controller("ClaseDashboardCtrl",['$scope', '$cookieStore', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', 'ResourceActividad', 'ResourceAlumno', '$filter', 'NgTableParams', function($scope, $cookieStore, $rootScope, $q, $http, $routeParams, $location, ResourceClase, ResourceActividad, ResourceAlumno, $filter, NgTableParams) {
	// SetDay
	SetDay = function(plusDays) {
		var currentDate = new Date(new Date().getTime() + plusDays * 24 * 60 * 60 * 1000);
		dd = currentDate.getDate();if(dd<10){dd='0'+dd } 
		mm = currentDate.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = currentDate.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}

	// SUBMIT
	$scope.save_asistencias = false;
	$scope.submitted = false;
	$scope.submit = function() {
		$scope.buttonDisabled = true;
		$cookieStore.put('clase_searched', $scope.clase);
		$rootScope.got_to_url_success = "/clase/dashboard";
		$scope.FormErrors = [];
		$scope.tableParams = new NgTableParams({
			page: claseDashboardDefaultPage,         	// initial first page
			count: claseDashboardDefaultCount,         // initial count per page
			filter: claseDashboardDefaultFilter, 		// initial filter
			sorting: claseDashboardDefaultSorting,		// initial sorting
			group: claseDashboardDefaultGrouping		// initial grouping
		}, {
			total: 0,          			 			// length of data
			counts: [],								// hides page sizes
			groupBy: claseDashboardDefaultGroupingBy,
			groupOptions: {isExpanded: true},
			getData: function(params) {
				// ajax request to api
				startLoading();
				return ResourceClase.index_instructor($scope.clase).$promise.then(function(data) {
					angular.forEach(data, function(value, key) {
						data[key]["cant_users"] = value.users.length+" / "+value.max_users;
						data[key]["horario"] = value.horario+'hs';
						data[key]["fecha_fixed"] = dateFormat(value.fecha);
					});
					$scope.clases = data;
					// Filter & Sort
					filteredData = params.filter() ? $filter('filter')(data, params.filter()): data;	
					orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
					// Show
					params.total(orderedData.inlineCount);
					$scope.buttonDisabled = false;
					stopLoading();
					return orderedData;
				});
			}
		});
	};
	// searchToday
	$scope.searchToday = function() {
		$scope.clase.fecha_start = SetDay(0);
		$scope.clase.fecha_end = SetDay(0);
		$scope.submit();
	}
	// moreClases
	$scope.moreClases = function() {
		oldate = $("#fecha_end").datepicker( "getDate" );
		oldate =  [oldate.getFullYear(),oldate.getMonth()+1,oldate.getDate()].join('-');
		$scope.scrollToSelector = $('.date_group').last();
		// $scope.clase.fecha_start = oldate
		var nwdate =  new Date(oldate);
		nwdate.setDate(nwdate.getDate()+10);
		nwdate =  [nwdate.getFullYear(),nwdate.getMonth()+1,nwdate.getDate()].join('-');
		$scope.clase.fecha_end = nwdate;
		$scope.submit();	
		$('html, body').animate({
			scrollTop: $scope.scrollToSelector.offset().top
		}, 2000);
	};
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fecha_start" ).datepicker({
			defaultDate: "+0d",
			onSelect: function(dateText) {
				$scope.clase.fecha_start=dateText;
				$("#fecha_end").datepicker("option", "minDate", dateText);
				var nwdate =  new Date(dateText);
				nwdate.setDate(nwdate.getDate()+10);
				nwdate =  [nwdate.getFullYear(),nwdate.getMonth()+1,nwdate.getDate()].join('-');
				$("#fecha_end").datepicker("setDate", nwdate);
				$scope.clase.fecha_end=nwdate;
		   }
		});
	});
	 $(function() {
		$( "#fecha_end" ).datepicker({
			defaultDate: '-2m',
			onSelect: function(dateText) {
				$scope.clase.fecha_end=dateText;
		   }
		});
	});
	// Destroy
	$scope.toDestroy = function(clase_id) {
		$scope.IdToDestroy = clase_id;
	};
	$scope.destroyClase = function() {
		$rootScope.got_to_url_success = "/clase/dashboard";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$.each($scope.clases, function(index) {
				if($scope.clases[index]!=undefined && $scope.clases[index].id == $scope.IdToDestroy) { //Remove from array
					ResourceClase.destroy($scope.deleteVariablesClaseToSend($scope.clases[index],true,true), $scope.callbackSuccess, $scope.callbackFailure);
					$scope.tableParams.reload();
				}    
			});
		})
	};
	// Confirm / Unconfirm asistencia
	$scope.editAsistencia = function(clase,alumno) {
		$scope.save_asistencias = true;
		alumno["asistencia_edited"] = true;
		clase["asistencia_edited"] = true;
		alumno.confirmed = !alumno.confirmed;
	};
	$scope.saveAsistencias = function() {
		asistencias_edited = [];
		$scope.clases_edited = $.grep($scope.clases, function(e){ return e.asistencia_edited == true; });
		angular.forEach($scope.clases_edited, function(clase_edited, key) {
			$scope.users_edited = $.grep(clase_edited.users, function(e){ return e.asistencia_edited == true; });
			angular.forEach($scope.users_edited, function(user_edited, key) {
				asistencias_edited.push(user_edited);
			});
		});
		$rootScope.got_to_url_success = "/clase/dashboard";
		ResourceClase.edit_asistencias(asistencias_edited, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Los cambios se guardaron correctamente!</div>').slideDown();
			$("html, body").animate({ scrollTop: 0 }, "slow");
		});
	};
	// Defaults
	$scope.GoToAlumnoEdit = function(id) {$location.path("/alumno/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/clase/new");};
	$scope.GoToEdit = function(id) {$location.path("/clase/"+id+"/edit/");};
	$scope.GoToBulk = function() {$location.path("/clase/bulk");};
	$scope.GoToEditBulk = function() {$location.path("/clase/edit_bulk");};
	$scope.columns_dashboard = columns_dashboard;
	$scope.cant_visible_cols = $.grep(columns_dashboard, function(e){ return e.visible == true; }).length+1;
	$scope.clase = new ResourceClase();
	$scope.InstructorIndex = ResourceAlumno.instructores();
	$scope.FormButton = '<i class="fa fa-search"></i> Buscar';
	$scope.InstructorIndex.$promise.then(function(data) {
		$scope.InstructorIndex.push({id:9999999, nombre_completo:'Todxs'});
		cookie_search = $cookieStore.get('clase_searched');
		cookie_search = false;
		if (cookie_search){ $scope.clase = cookie_search;}else
		{
			if (typeof $scope.is_instructor !== 'undefined' && $scope.is_instructor){
				if( $scope.instructor_id==4){//Vicky=>Todxs;
					$scope.clase.instructor_id = 9999999;
				}else{
					$scope.clase.instructor_id = $scope.instructor_id;
				}
			}
			else{	$scope.clase.instructor_id = $scope.InstructorIndex[InstructorIndexDefault].id;}
			$scope.clase.fecha_end = SetDay(+10);
			$scope.clase.fecha_start = SetDay(0);
		}
		$("#fecha_end").datepicker("option", "minDate", SetDay(0));
		$scope.submit();
	});
	
stopLoading();}]);
