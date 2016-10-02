angular.module("TurnosApp").controller("ClaseInstructorCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', 'ResourceActividad', 'ResourceAlumno', '$filter', 'NgTableParams', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceClase, ResourceActividad, ResourceAlumno, $filter, NgTableParams) {
	// SetDay
	SetDay = function(minusMonth) {
		today = new Date();
		dd = today.getDate();if(dd<10){dd='0'+dd } 
		mm = today.getMonth()+1-minusMonth;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = today.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
	// From
	$scope.GoToEdit = function(id) {$location.path("/clase/"+id+"/edit/");};
	$scope.columns_instructor = columns_instructor;
	$scope.clase = new ResourceClase();
	$scope.InstructorIndex = ResourceAlumno.instructores();
	$scope.clase.fecha_end = SetDay(0);
	$scope.clase.fecha_start = SetDay(1);
	$scope.InstructorIndex.$promise.then(function(data) {
		$scope.clase.instructor_id = $scope.InstructorIndex[InstructorIndexDefault].id;
	});
	$scope.FormTitle = "<i class='fa fa-search'></i> Clases por instructor";
	$scope.FormButton = '<i class="fa fa-search"></i> Buscar';

	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$rootScope.got_to_url_success = "/clase/instructor";
		$scope.FormErrors = [];
		if ($scope.ClaseForm.$valid) {
			console.log("valid submit");

			$scope.tableParams = new NgTableParams({
				page: claseInstructorPage,         	// initial first page
				count: claseInstructorCount,         	// initial count per page
				filter: claseInstructorFilter, 		// initial filter
				sorting: claseInstructorSorting, 		// initial sorting
			}, {
				total: 0,           				// length of data
				counts: clasePageSizes,				// page size buttons
				getData: function(params) {
					// ajax request to api
					startLoading();
					return ResourceClase.instructor($scope.clase).$promise.then(function(data) {
						angular.forEach(data, function(value, key) {
							data[key]["cant_users"] = value.users.length+" / "+value.max_users;
							data[key]["fecha_fixed"] = value.dia+' ' +dateFormat(value.fecha);
						});
						$scope.clases = data;
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
		} else {
			$scope.ClaseForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};

	$scope.searchToday = function() {
		$scope.clase.fecha_end = SetDay(0);
		$scope.clase.fecha_start = SetDay(0);
	}
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fecha_start" ).datepicker({
			defaultDate: "+0d",
			onSelect: function(dateText) {
				$scope.clase.fecha_start=dateText;
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
		$rootScope.got_to_url_success = "/clase/index";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$.each($scope.clases, function(index) {
				if($scope.clases[index]!=undefined && $scope.clases[index].id == $scope.IdToDestroy) { //Remove from array
					ResourceClase.destroy($scope.deleteVariablesClaseToSend($scope.clases[index],true,true), $scope.callbackSuccess, $scope.callbackFailure);
					$scope.tableParams.reload();
				}    
			});
		})
	};
stopLoading();}]);
