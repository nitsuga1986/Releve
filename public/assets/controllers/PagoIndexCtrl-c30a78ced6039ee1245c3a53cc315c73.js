angular.module("TurnosApp").controller("PagoIndexCtrl",['$scope', '$rootScope', '$location', 'ResourcePago', '$filter','NgTableParams', '$timeout', function($scope, $rootScope, $location, ResourcePago, $filter, NgTableParams, $timeout) {
	//	$scope.practicantes = ResourcePracticante.index();
	$scope.GoToEdit = function(id) {$location.path("/pago/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/pago/new");};
	// ngTable
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
	var Api = ResourcePago;
	$scope.columns_pago = columns_pago
	$scope.cant_visible_cols = $.grep(columns_pago, function(e){ return e.visible == true; }).length+1;
    $scope.tableParams = new NgTableParams({
		page: pagoDefaultPage,         	// initial first page
		count: pagoDefaultCount,         	// initial count per page
		sorting: pagoDefaultSorting 		// initial sorting
	}, {
		total: 0,           // length of data
		getData: function(params) {
			// ajax request to api
			startLoading();
			return Api.index().$promise.then(function(data) {
				angular.forEach(data, function(value, key) {
					data[key]["monto"] = '$'+value.monto;
					data[key]["mes"] = monthNames[value.mes-1];
				});
				$scope.pagos = data;
				// Filter & Sort
				filteredData = params.filter() ? $filter('filter')(data, params.filter()): data;	
				orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				// Show
				params.total(orderedData.inlineCount);
				stopLoading();
				return orderedData;
			});
		}
    });
	// Reload button
	$scope.reloadTable = function(id) {
		$scope.tableParams.reload();
	};
	// Destroy
	$scope.toDestroy = function(pago_id) {
			console.log("pago_id",pago_id)
		$scope.IdToDestroy = pago_id;
	};
	$scope.destroyPago = function() {
		$rootScope.got_to_url_success = "/pago/index";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$.each($scope.pagos, function(index) {
				if($scope.pagos[index]!=undefined && $scope.pagos[index].id == $scope.IdToDestroy) { //Remove from array
					ResourcePago.destroy($scope.pagos[index], $scope.callbackSuccess, $scope.callbackFailure);
					$scope.tableParams.reload();
				}
			});
		})
	};
}]);















