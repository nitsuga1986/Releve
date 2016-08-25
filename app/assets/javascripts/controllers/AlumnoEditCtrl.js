angular.module("TurnosApp").controller("AlumnoEditCtrl",['$scope', '$q', '$http', '$routeParams', '$location', 'ResourceAlumno', function($scope, $q, $http, $routeParams, $location, ResourceAlumno) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.sexosArray = sexosArray;
	$scope.submiterror = false;
	$scope.history_GoToAlumnoEdit = []; // Prevents loop search
	$scope.GoToIndex = function(id) {$location.path("/alumno/index");};

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
		$scope.FormTitle = "<i class='fa fa-user'></i> Editar datos de la alumno";
		$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar cambios';
		$scope.alumno = ResourceAlumno.show({ id: $routeParams.id });
		$scope.alumno.$promise.then(function( value ){},function( error ){$location.path("/alumno/new");});	// if id not exists => ToNew
	} else { 				// New
		$scope.FormTitle = "<i class='fa fa-user'></i> Agregar nuevo alumno";
		$scope.FormButton = '<i class="fa fa-alumno-plus fa-lg"></i> Agregar alumno';
		$scope.alumno = new ResourceAlumno();
		$scope.alumno.alumnos = [];
		$scope.alumno.fecha = $scope.SetToday()
	}
	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$scope.FormErrors = [];
		if ($scope.AlumnoForm.$valid) {
			console.log("valid submit");
			// Success
			function success(response) {
				console.log("success", response);
				$location.path("/alumno/index");
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
				ResourceAlumno.update($scope.alumno, success, failure);
			} else {
				ResourceAlumno.create($scope.alumno, success, failure); 	
			}
		} else {
			$scope.AlumnoForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};
	// Delete Alumno
	$scope.DeleteAlumno = function(id) {
		$.each($scope.alumno.alumnos, function(index) {
			if($scope.alumno.alumnos[index]!=undefined && $scope.alumno.alumnos[index].id == id) { //Remove from array
				$scope.alumno.alumnos.splice(index, 1);
			}    
		});
	};
	// GoTo
  	$scope.GoToAlumnoEdit = function() {
		if($scope.history_GoToAlumnoEdit.indexOf($scope.alumno.email) == -1){
			if($scope.alumno.email!=undefined&&$scope.alumno.email!=null&&$scope.alumno.email!=''){
				$scope.history_GoToAlumnoEdit.push($scope.alumno.email);
				$http.get('/api/alumnos/search', {params: { email:$scope.alumno.email}}).
				success(function(data, status, headers, config) {
					if(data.id!=undefined){
						$location.path("/alumno/"+data.id+"/edit");
					}else{};
				});
			};
		};
	};
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fechanac" ).datepicker({
			defaultDate: "+0D",
			onSelect: function(dateText) {
				$scope.alumno.fechanac=dateText;
		   }
		});
	});
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fechaini" ).datepicker({
			defaultDate: "+0D",
			onSelect: function(dateText) {
				$scope.alumno.fechaini=dateText;
		   }
		});
	});
		
}]);
