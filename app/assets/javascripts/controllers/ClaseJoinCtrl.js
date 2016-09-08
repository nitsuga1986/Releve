angular.module("TurnosApp").controller("ClaseJoinCtrl",['$scope', '$location', 'ResourceClase', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceClase, $filter, NgTableParams, $timeout) {
	// ngTable
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
	var Api = ResourceClase;
	$scope.columns_claseJoin = columns_claseJoin;
	$scope.cant_visible_cols = $.grep(columns_claseJoin, function(e){ return e.visible == true; }).length+1;
    $scope.tableParams = new NgTableParams({
		page: claseJoinDefaultPage,         	// initial first page
		count: claseJoinDefaultCount,         	// initial count per page
		filter: claseJoinDefaultFilter, 		// initial filter
		sorting: claseJoinDefaultSorting, 		// initial sorting
		group: claseJoinDefaultGrouping
	}, {
		total: 0,           // length of data
		groupBy: claseJoinDefaultGroupingBy,
		groupOptions: {isExpanded: true},
		getData: function(params) {
			// ajax request to api
			startLoading();
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
				stopLoading();
				return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
			});
		}
    });
}]);
