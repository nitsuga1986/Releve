angular.module("TurnosApp").controller("ClaseIndexCtrl",['$scope', '$location', 'ResourceClase', '$filter','ngTableParams', '$timeout', function($scope, $location, ResourceClase, $filter, ngTableParams, $timeout) {
	$scope.GoToEdit = function(id) {$location.path("/dashboard/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/dashboard/new");};
	$scope.GoToBulk = function() {$location.path("/dashboard/bulk");};
	// ngTable
	var Api = ResourceClase;
	$scope.columns_clase = columns_clase
	$scope.tableParams = new ngTableParams({
		page: claseDefaultPage,         	// initial first page
		count: claseDefaultCount,         	// initial count per page
		filter: claseDefaultFilter, 		// initial filter
		sorting: claseDefaultSorting 		// initial sorting
	}, {
		total: 0,           // length of data
		getData: function($defer, params) {
			// ajax request to api
			$scope.loading=true;
			Api.index({}, function(data) {
				// update table params
				$scope.clases = data;
				params.total(data.length);
				angular.forEach(data, function(value, key) {
					data[key]["cant_users"] = value.users.length+" / "+value.max_users;
					data[key]["dia"] = dayNames[(new Date(value.fecha+'T12:00:00Z')).getDay()];
				});
				var filteredData = params.filter() ?
				$filter('filter')(data, params.filter()) : data;
				var orderedData = params.sorting() ?
				$filter('orderBy')(filteredData, params.orderBy()) : data;
				$scope.tableResults = '('+data.length+')';
				$scope.loading=false;
				// set new data
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			});
		}
	});
	// Reload button
	$scope.reloadTable = function(id) {
		$scope.tableParams.reload();
	};
	$scope.toDestroy = "";
	// Success
	function success(response) {
		console.log("success", response);
		$location.path("/dashboard/index");
		$scope.tableParams.reload();
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
	$scope.toDestroy = function(clase_id) {
			console.log("clase_id",clase_id)
		$scope.IdToDestroy = clase_id;
	};
	$scope.destroyClase = function() {
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$.each($scope.clases, function(index) {
				console.log("Clase",$scope.clases[index])
				if($scope.clases[index]!=undefined && $scope.clases[index].id == $scope.IdToDestroy) { //Remove from array
					console.log("Claseindex",$scope.clases[index])
					ResourceClase.destroy($scope.clases[index], success, failure);
				}    
			});
		})
	};
}]);















