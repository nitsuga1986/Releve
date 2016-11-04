angular.module("TurnosApp").controller("PagoEditCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourcePago', 'ResourceActividad', 'ResourceAlumno', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourcePago, ResourceActividad, ResourceAlumno) {
	$scope.submiterror = false;
	$scope.pago = new ResourcePago();
	$scope.AlumnoIndex = ResourceAlumno.index();
	$scope.ActividadIndex = ResourceActividad.index();
	// Edit or New
	if ($routeParams.id) { 	// Edit
		$scope.FormTitle = "<i class='fa fa-usd'></i> Editar pago";
		$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar';
		$scope.pago = ResourcePago.show({ id: $routeParams.id });
		$scope.pago.$promise.then(function( value ){},function( error ){$location.path("/pago/new");});	// if id not exists => ToNew
	} else { 				// New
		$scope.FormTitle = "<i class='fa fa-usd'></i> Ingresar pago";
		$scope.FormButton = '<i class="fa fa-plus-square fa-lg"></i> Agregar';
		// SetToday
		SetToday = function(scope_date) {
			today = new Date();
			dd = today.getDate();if(dd<10){dd='0'+dd } 
			mm = today.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
			yyyy = today.getFullYear();
			return yyyy+'-'+mm+'-'+dd
		};
		$scope.pago.fecha = SetToday();
		$scope.pago.mes = parseInt($scope.pago.fecha.substring(5, 7));
		$scope.ActividadIndex.$promise.then(function( value ){
			$scope.pago.actividad_id = value[0].id;
		});
	}

	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$rootScope.got_to_url_success = "/pago/index";
		if ($scope.PagoForm.$valid) {
			console.log("valid submit");
			// Update or Create
			if ($routeParams.id) {
				ResourcePago.update($scope.pago, $scope.callbackSuccess, $scope.callbackFailure);
			} else {
				ResourcePago.create($scope.pago, $scope.callbackSuccess, $scope.callbackFailure); 	
			}
		} else {
			$scope.PagoForm.submitted = true;
			window.scrollTo(0, 0);
		}
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
