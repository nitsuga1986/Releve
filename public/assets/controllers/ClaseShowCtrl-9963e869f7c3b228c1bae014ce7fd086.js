angular.module("TurnosApp").controller("ClaseShowCtrl",['$scope', '$rootScope', '$routeParams', '$location', 'ResourceClase', function($scope, $rootScope, $routeParams, $location, ResourceClase) {
	$scope.clase = ResourceClase.show({ id: $routeParams.id });
	$scope.clase.$promise.then(function(data){console.log(data);},function( error ){$location.path("/dashboard/index");});
	// Destroy
	$scope.destroyClase = function() {
		$rootScope.got_to_url_success = "/clase/instructor";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$scope.clase.users = null;
			ResourceClase.destroy($scope.clase, $scope.callbackSuccess, $scope.callbackFailure);
		})
	};
stopLoading();}]);
