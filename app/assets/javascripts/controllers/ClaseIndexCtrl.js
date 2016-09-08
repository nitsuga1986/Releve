angular.module("TurnosApp").controller("ClaseIndexCtrl",['$scope', '$location', 'ResourceClase', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceClase, $filter, NgTableParams, $timeout) {
	$scope.GoToEdit = function(id) {$location.path("/dashboard/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/dashboard/new");};
	$scope.GoToBulk = function() {$location.path("/dashboard/bulk");};
	// ngTable
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
	var Api = ResourceClase;
	$scope.columns_clase = columns_clase;
	$scope.cant_visible_cols = $.grep(columns_clase, function(e){ return e.visible == true; }).length+1;
    $scope.tableParams = new NgTableParams({
		page: claseDefaultPage,         	// initial first page
		count: claseDefaultCount,         	// initial count per page
		filter: claseDefaultFilter, 		// initial filter
		sorting: claseDefaultSorting, 		// initial sorting
		group: claseDefaultGrouping
	}, {
		total: 0,           // length of data
		groupBy: claseDefaultGroupingBy,
		groupOptions: {isExpanded: false},
		getData: function(params) {
			// ajax request to api
			return Api.index(params.url()).$promise.then(function(data) {
				$scope.clases = data;
				angular.forEach(data, function(value, key) {
					data[key]["instructor_nombre_completo"] = value.instructor.nombre_completo;
					data[key]["cant_users"] = value.users.length+" / "+value.max_users;
					data[key]["fecha_fixed"] = dateFormat(value.fecha) ;
					data[key]["dia"] = dayNames[(new Date(value.fecha+'T12:00:00Z')).getDay()];
				});
				var filteredData = params.filter() ?
				$filter('filter')(data, params.filter()) : data;
				var orderedData = params.sorting() ?
				$filter('orderBy')(filteredData, params.orderBy()) : data;
				params.total(data.inlineCount);
				$scope.loading=false;
				return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
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















