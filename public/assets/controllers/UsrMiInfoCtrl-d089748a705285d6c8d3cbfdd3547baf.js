angular.module("TurnosApp").controller("UsrMiInfoCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceAlumno', 'ResourceActividad', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceAlumno, ResourceActividad) {
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
		$scope.buttonDisabled = true;
		$rootScope.got_to_url_success = "/app/mi_info";
		$scope.FormErrors = [];
		if ($scope.AlumnoForm.$valid) {
			console.log("valid submit");
			// Update
			ResourceAlumno.update_current($scope.alumno, $scope.callbackSuccess, $scope.callbackFailure);
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> listo! </strong> Los datos se han guardado correctamente</div>').slideDown();
			window.scrollTo(0, 0);
			$scope.buttonDisabled = false;
		} else {
			$scope.AlumnoForm.submitted = true;
			$scope.buttonDisabled = false;
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
