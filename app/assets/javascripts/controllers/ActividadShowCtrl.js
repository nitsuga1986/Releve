angular.module("TurnosApp").controller("ActividadShowCtrl",['$scope', '$routeParams', '$location', 'ResourceActividad', function($scope, $routeParams, $location, ResourceActividad) {
	$scope.actividad = ResourceActividad.show({ id: $routeParams.id });
	$scope.actividad.$promise.then(function(data){console.log(data);},function( error ){$location.path("/actividad/index");});
	// Destroy
	$scope.destroyPraticante = function() {
		$scope.got_to_url_success("/actividad/index");
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$scope.actividad.practicantes = null;
			ResourceActividad.destroy($scope.actividad, $scope.callbackSuccess, $scope.callbackFailure);
		})
	};
stopLoading();}]);
