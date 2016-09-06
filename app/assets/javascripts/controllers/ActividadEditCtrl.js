angular.module("TurnosApp").controller("ActividadEditCtrl",['$scope', '$q', '$http', '$routeParams', '$cacheFactory', '$location', 'ResourceActividad', function($scope, $q, $http, $routeParams, $cacheFactory, $location, ResourceActividad) {

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
		if ($scope.ActividadForm.$valid) {
			console.log("valid submit");
			// Success
			function success(response) {
				console.log("success", response);
				$cacheFactory.get('$http').remove("/dashboard/actividad");
				$location.path("/dashboard/actividad/index");
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
				ResourceActividad.update($scope.actividad, success, failure);
			} else {
				ResourceActividad.create($scope.actividad, success, failure); 	
			}
		} else {
			$scope.ActividadForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};
		
}]);
