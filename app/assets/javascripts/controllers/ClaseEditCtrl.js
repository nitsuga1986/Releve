angular.module("TurnosApp").controller("ClaseEditCtrl",['$scope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', 'ResourceActividad', 'ResourceAlumno', function($scope, $q, $http, $routeParams, $location, ResourceClase, ResourceActividad, ResourceAlumno) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.submiterror = false;
	$scope.history_GoToClaseEdit = []; // Prevents loop search
	$scope.GoToIndex = function(id) {$location.path("/dashboard/index");};
	$scope.GoToNewActividad = function() {$location.path("/dashboard/actividad/new");};
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
	// Edit or New
	if ($routeParams.id) { 	// Edit
		$scope.FormTitle = "<i class='fa fa-calendar'></i> Editar datos de la clase";
		$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar cambios';
		$scope.clase = ResourceClase.show({ id: $routeParams.id });
		$scope.clase.$promise.then(function( value ){},function( error ){$location.path("/dashboard/new");});	// if id not exists => ToNew
	} else { 				// New
		$scope.FormTitle = "<i class='fa fa-calendar'></i> Agregar nueva clase";
		$scope.FormButton = '<i class="fa fa-calendar fa-lg"></i> Agregar clase';
		$scope.clase = new ResourceClase();
		$scope.clase.users = [];
		$scope.clase.fecha = $scope.SetToday();
		$scope.clase.max_users = 4; 
		$scope.clase.actividad = 'Pilates'; 
		$scope.ActividadIndex.$promise.then(function(data) {
			$scope.clase.actividad_id = $scope.ActividadIndex[ActividadIndexDefault].id;
		});
		$scope.InstructorIndex.$promise.then(function(data) {
			$scope.clase.instructor_id = $scope.InstructorIndex[InstructorIndexDefault].id;
		});
	}
	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$scope.FormErrors = [];
		if ($scope.ClaseForm.$valid) {
			console.log("valid submit");
			// Success
			function success(response) {
				console.log("success", response);
				$location.path("/dashboard/index");
			}
			// Failure
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
			// Update or Create
			if ($routeParams.id) {
				ResourceClase.update($scope.clase, success, failure);
			} else {
				ResourceClase.create($scope.clase, success, failure); 	
			}
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
	// Autocomplete
	$(function() {
		$( "#search_user" ).autocomplete({
			source: '/api/alumnos/autocomplete',
			minLength: 2,
			select: function( event, ui ) {
				$scope.clase.users = $scope.clase.users.concat(ui.item);
				console.log(ui.item);
				$scope.$apply();
				$(this).val("");
				return false;
			}
		});
	});
	// GoTo
  	$scope.GoToClaseEdit = function() {
		if($scope.history_GoToClaseEdit.indexOf($scope.clase.fecha+$scope.clase.horario) == -1){
			if($scope.clase.fecha!=undefined&&$scope.clase.fecha!=null&&$scope.clase.fecha!=''&&$scope.clase.horario!=undefined&&$scope.clase.horario!=null&&$scope.clase.horario!=''){
				$scope.history_GoToClaseEdit.push($scope.clase.fecha+$scope.clase.horario);
				$http.get('/api/clases/search', {params: { fecha:$scope.clase.fecha, horario:$scope.clase.horario}}).
				success(function(data, status, headers, config) {
					if(data.id!=undefined){
						$location.path("/dashboard/"+data.id+"/edit");
					}else{};
				});
			};
		};
	};
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fecha" ).datepicker({
			defaultDate: "+0D",
			onSelect: function(dateText) {
				$scope.clase.fecha=dateText;
		   }
		});
	});
stopLoading();}]);
