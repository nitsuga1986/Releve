angular.module("TurnosApp").controller("ClaseEditCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', 'ResourceActividad', 'ResourceAlumno', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceClase, ResourceActividad, ResourceAlumno) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.submiterror = false;
	$scope.history_GoToClaseEdit = []; // Prevents loop search
	$scope.GoToIndex = function(id) {$location.path("/clase/index");};
	$scope.GoToEdit = function(id) {$location.path("/alumno/"+id+"/edit/");};
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
	// Edit or New
	if ($routeParams.id) { 	// Edit
		$scope.FormTitle = "<i class='fa fa-calendar'></i> Editar datos de la clase";
		$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar cambios';
		$scope.clase = ResourceClase.show({ id: $routeParams.id });
		$scope.clase.$promise.then(function( value ){
			$scope.clase.duracion = parseFloat($scope.clase.duracion);
			$scope.clase.instructor_id = $scope.clase.instructor.id;
			if($scope.clase.reemplazo!=null){$scope.clase.reemplazo_id = $scope.clase.reemplazo.id};
		},function( error ){$location.path("/clase/new");});	// if id not exists => ToNew
	} else { 				// New
		$scope.FormTitle = "<i class='fa fa-calendar'></i> Agregar nueva clase";
		$scope.FormButton = '<i class="fa fa-calendar fa-lg"></i> Agregar clase';
		$scope.clase = new ResourceClase();
		$scope.clase.users = [];
		$scope.clase.fecha = $scope.SetToday();
		$scope.clase.max_users = 4; 
		$scope.clase.duracion = 1; 
		$scope.clase.trialable = true; 
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
		$rootScope.got_to_url_success = "/clase/index";
		$scope.FormErrors = [];
		if ($scope.ClaseForm.$valid) {
			console.log("valid submit");
			// Update or Create
			if ($routeParams.id) {
				ResourceClase.update($scope.clase, $scope.callbackSuccess, $scope.callbackFailure);
			} else {
				ResourceClase.create($scope.clase, $scope.callbackSuccess, $scope.callbackFailure); 	
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
	// GoTo Search
  	$scope.GoToClaseEdit = function() {
		if($scope.history_GoToClaseEdit.indexOf($scope.clase.fecha+$scope.clase.horario+$scope.clase.instructor_id) == -1){
			if($scope.clase.fecha!=undefined&&$scope.clase.fecha!=null&&$scope.clase.fecha!=''&&$scope.clase.horario!=undefined&&$scope.clase.horario!=null&&$scope.clase.horario!=''&&$scope.clase.instructor_id!=undefined&&$scope.clase.instructor_id!=null&&$scope.clase.instructor_id!=''){
				$scope.history_GoToClaseEdit.push($scope.clase.fecha+$scope.clase.horario+$scope.clase.instructor_id);
				$http.get('/api/clases/search', {params: { fecha:$scope.clase.fecha, horario:$scope.clase.horario, instructor:$scope.clase.instructor_id}}).
				success(function(data, status, headers, config) {
					if(data.id!=undefined){
						$location.path("/clase/"+data.id+"/edit");
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
