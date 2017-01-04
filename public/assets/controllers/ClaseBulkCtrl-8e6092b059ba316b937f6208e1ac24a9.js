angular.module("TurnosApp").controller("ClaseBulkCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', 'ResourceActividad', 'ResourceAlumno', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceClase, ResourceActividad, ResourceAlumno) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.submiterror = false;
	$scope.GoToNewActividad = function() {$location.path("/actividad/new");};
	$scope.ActividadIndex = [];
	$scope.ActividadIndex = ResourceActividad.index();
	$scope.InstructorIndex = ResourceAlumno.instructores();
	// SetDay
	SetDay = function(plusDays) {
		var currentDate = new Date(new Date().getTime() + plusDays * 24 * 60 * 60 * 1000);
		dd = currentDate.getDate();if(dd<10){dd='0'+dd } 
		mm = currentDate.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = currentDate.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	// Bulk
	$scope.clase = new ResourceClase();
	$scope.clase.fecha_start = SetDay(0);
	$scope.clase.fecha_end = SetDay(30);
	$scope.clase.max_users = 4;
	$scope.clase.duracion = 1; 
	$scope.ActividadIndex.$promise.then(function(data) {
		$scope.clase.actividad_id = $scope.ActividadIndex[ActividadIndexDefault].id;
	});
	$scope.InstructorIndex.$promise.then(function(data) {
		$scope.clase.instructor_id = $scope.InstructorIndex[InstructorIndexDefault].id;
	});
	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$scope.buttonDisabled = true;
		$rootScope.got_to_url_success = "/clase/dashboard";
		$scope.FormErrors = [];
		if ($scope.ClaseForm.$valid) {
			console.log("valid submit");
			ResourceClase.bulk($scope.clase, $scope.callbackSuccess, $scope.callbackFailure);

		} else {
			$scope.ClaseForm.submitted = true;
			$scope.buttonDisabled = false;
			window.scrollTo(0, 0);
		}
	};
	// filterDayChange
	$scope.clase.filterDay = new Array(59).fill(false);
	$scope.filterDayChange = function(day,event) {
		event.preventDefault();
		$scope.clase.filterDay[day] = !$scope.clase.filterDay[day];
	};
	// Datepickers
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
			defaultDate: "+1m",
			onSelect: function(dateText) {
				$scope.clase.fecha_end=dateText;
		   }
		});
	});
stopLoading();}]);
