angular.module("TurnosApp").controller("ClaseEditBulkCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', 'ResourceActividad', 'ResourceAlumno', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceClase, ResourceActividad, ResourceAlumno) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.submiterror = false;
	$scope.GoToIndex = function(id) {$location.path("/clase/dashboard");};
	$scope.GoToNewActividad = function() {$location.path("/actividad/new");};
	$scope.ActividadIndex = [];
	$scope.ActividadIndex = ResourceActividad.index();
	$scope.InstructorIndex = ResourceAlumno.instructores();
	// SetToday
	$scope.SetToday = function(scope_date) {
		today = new Date();
		dd = today.getDate();if(dd<10){dd='0'+dd } 
		mm = today.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = today.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	// Bulk
	$scope.FormTitle = "<i class='fa fa-calendar'></i> Editar clases";
	$scope.FormButton = '<i class="fa fa-calendar fa-lg"></i> Editar';
	$scope.clase = new ResourceClase();
	$scope.clase.fecha_start = $scope.SetToday();
	$scope.clase.fecha_end = $scope.SetToday();
	$scope.clase.max_users = 4;
	$scope.clase.duracion = 1; 
	$scope.clase.trialable = true;
	$scope.ActividadIndex.$promise.then(function(data) {
		$scope.clase.actividad_id = $scope.ActividadIndex[ActividadIndexDefault].id;
	});
	$scope.InstructorIndex.$promise.then(function(data) {
		$scope.clase.instructor_id = $scope.InstructorIndex[InstructorIndexDefault].id;
	});
	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$rootScope.got_to_url_success = "/clase/dashboard";
		$scope.FormErrors = [];
		if ($scope.ClaseForm.$valid) {
			console.log("valid submit");
			ResourceClase.edit_bulk($scope.clase, $scope.callbackSuccess, $scope.callbackFailure);

		} else {
			$scope.ClaseForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};
	// Delete User
	$scope.DeleteUser = function(id) {
		$.each($scope.clase.users, function(index) {
			if($scope.clase.users[index]!=undefined && $scope.clase.users[index].id == id) { //Remove from array
				$scope.clase.users.splice(index, 1);
			}    
		});
	};
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
			defaultDate: "+1m",
			onSelect: function(dateText) {
				$scope.clase.fecha_end=dateText;
		   }
		});
	});
stopLoading();}]);
