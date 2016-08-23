angular.module("TurnosApp").controller("AlumnoShowCtrl",['$scope', '$routeParams', '$location', 'ResourceAlumno', function($scope, $routeParams, $location, ResourceAlumno) {
	$scope.alumno = ResourceAlumno.show({ id: $routeParams.id });
	$scope.alumno.$promise.then(function(data){console.log(data);},function( error ){$location.path("/alumno/index");});
	// Success
	function success(response) {
		console.log("success", response);
		$location.path("/alumno/index");
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
	$scope.destroyAlumno = function() {
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$scope.alumno.alumnos = null;
			ResourceAlumno.destroy($scope.alumno, success, failure);
		})
	};
}]);
