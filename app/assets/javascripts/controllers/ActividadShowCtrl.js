angular.module("TurnosApp").controller("ActividadShowCtrl",['$scope', '$routeParams', '$location', 'ResourceActividad', function($scope, $routeParams, $location, ResourceActividad) {
	$scope.actividad = ResourceActividad.show({ id: $routeParams.id });
	$scope.actividad.$promise.then(function(data){console.log(data);},function( error ){$location.path("/actividad/index");});
	// Success
	function success(response) {
		console.log("success", response);
		$location.path("/actividad/index");
	}
	// Failure
	function failure(response) {
		console.log("failure", response)
		_.each(response.data, function(errors, key) {
			_.each(errors, function(e) {
				$scope.form[key].$dirty = true;
				$scope.form[key].$setValidity(e, false);
			});
		});
	}
	// Destroy
	$scope.destroyPraticante = function() {
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$scope.actividad.practicantes = null;
			ResourceActividad.destroy($scope.actividad, success, failure);
		})
	};
stopLoading();}]);
