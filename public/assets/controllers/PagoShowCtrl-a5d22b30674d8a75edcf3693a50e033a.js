angular.module("TurnosApp").controller("PagoShowCtrl",['$scope', '$rootScope', '$routeParams', '$location', 'ResourcePago', function($scope, $rootScope, $routeParams, $location, ResourcePago) {
	$scope.pago = ResourcePago.show({ id: $routeParams.id });
	$scope.pago.$promise.then(function(data){console.log(data);},function( error ){$location.path("/pago/index");});
	// Destroy
	$scope.destroyPraticante = function() {
		$rootScope.got_to_url_success = "/pago/index";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$scope.pago.practicantes = null;
			ResourcePago.destroy($scope.pago, $scope.callbackSuccess, $scope.callbackFailure);
		})
	};
stopLoading();}]);
