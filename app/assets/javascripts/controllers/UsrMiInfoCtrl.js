angular.module("TurnosApp").controller("UsrMiInfoCtrl",['$scope', '$q', '$http', '$routeParams', '$location', 'ResourceAlumno', 'ResourceActividad', function($scope, $q, $http, $routeParams, $location, ResourceAlumno, ResourceActividad) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.sexosArray = sexosArray;
	$scope.submiterror = false;
	$scope.ActividadIndex = [];
	$scope.formsuccessalert = false;
	$scope.formerroralert = false;
	// SetToday
	$scope.SetToday = function(scope_date) {
		today = new Date();
		dd = today.getDate();if(dd<10){dd='0'+dd } 
		mm = today.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = today.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	// Edit
	$scope.FormTitle = "<i class='fa fa-user'></i> Datos de mi cuenta";
	$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar';
	$scope.alumno = ResourceAlumno.current();
	$scope.alumno.$promise.then(function( value ){
		ResourceActividad.index().$promise.then(function(ActividadIndex){
			$scope.ActividadIndex = ActividadIndex;
			$.each($scope.ActividadIndex, function(index_actividades) {
				notincluded = true;
				$.each($scope.alumno.packs, function(index_pack) {
					if($scope.ActividadIndex[index_actividades].id==$scope.alumno.packs[index_pack].actividad_id){notincluded=false;}
				});
				if(notincluded){
					missing_pack = {"actividad_id":$scope.ActividadIndex[index_actividades].id,"cantidad":null,"noperiod":true,"fecha_start":null,"fecha_end":null,"actividad":$scope.ActividadIndex[index_actividades]}
					$scope.alumno.packs.push(missing_pack);
				}
			});
		});
	},function( error ){$location.path("/app/mi_info");});	// if id not exists => ToNew

	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$scope.FormErrors = [];
		if ($scope.AlumnoForm.$valid) {
			console.log("valid submit");
			// Success
			function success(response) {
				console.log("success", response);
				$location.path("/app/mi_info");
				$scope.formsuccessalert = true;
			}
			// Failure
			function failure(response) {
				$scope.formerroralert = true;
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
			// Update
			ResourceAlumno.update_current($scope.alumno, success, failure);
		} else {
			$scope.AlumnoForm.submitted = true;
			window.scrollTo(0, 0);
		}
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
stopLoading();}]);
