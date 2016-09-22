angular.module("TurnosApp").controller("AlumnoShowCtrl",['$scope', '$routeParams', '$location', 'ResourceAlumno', function($scope, $routeParams, $location, ResourceAlumno) {
	$scope.alumno = ResourceAlumno.show({ id: $routeParams.id });
	$scope.alumno.$promise.then(function(data){console.log(data);},function( error ){$location.path("/alumno/index");});
	// Destroy
	$scope.destroyAlumno = function() {
		$scope.got_to_url_success("/alumno/index");
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$scope.alumno.alumnos = null;
			ResourceAlumno.destroy($scope.alumno, $scope.callbackSuccess, $scope.callbackFailure);
		})
	};
stopLoading();}]);
