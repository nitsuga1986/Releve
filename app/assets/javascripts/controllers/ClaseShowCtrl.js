angular.module("TurnosApp").controller("ClaseShowCtrl",['$scope', '$routeParams', '$location', 'ResourceClase', function($scope, $routeParams, $location, ResourceClase) {
	$scope.clase = ResourceClase.show({ id: $routeParams.id });
	$scope.clase.$promise.then(function(data){console.log(data);},function( error ){$location.path("/dashboard/index");});
	// Success
	function success(response) {
		console.log("success", response);
		$location.path("/dashboard/index");
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
	$scope.destroyClase = function() {
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$scope.clase.users = null;
			ResourceClase.destroy($scope.clase, success, failure);
		})
	};
}]);
