angular.module("TurnosApp").controller("ActividadEditCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceActividad', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceActividad) {
	$scope.submiterror = false;
	// Edit or New
	if ($routeParams.id) { 	// Edit
		$scope.FormTitle = "<i class='fa fa-cog'></i> Editar datos de la actividad";
		$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar';
		$scope.actividad = ResourceActividad.show({ id: $routeParams.id });
		$scope.actividad.$promise.then(function( value ){},function( error ){$location.path("/actividad/new");});	// if id not exists => ToNew
	} else { 				// New
		$scope.FormTitle = "<i class='fa fa-cog'></i> Agregar nueva actividad";
		$scope.FormButton = '<i class="fa fa-plus-square fa-lg"></i> Agregar';
		$scope.actividad = new ResourceActividad();
	}

	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$rootScope.got_to_url_success = "/actividad/index";
		if ($scope.ActividadForm.$valid) {
			console.log("valid submit");
			// Update or Create
			if ($routeParams.id) {
				ResourceActividad.update($scope.actividad, $scope.callbackSuccess, $scope.callbackFailure);
			} else {
				ResourceActividad.create($scope.actividad, $scope.callbackSuccess, $scope.callbackFailure); 	
			}
		} else {
			$scope.ActividadForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};
stopLoading();}]);
