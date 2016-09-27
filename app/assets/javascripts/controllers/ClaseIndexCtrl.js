angular.module("TurnosApp").controller("ClaseIndexCtrl",['$scope', '$rootScope', '$location', 'ResourceClase', '$filter','NgTableParams', '$timeout', function($scope, $rootScope, $location, ResourceClase, $filter, NgTableParams, $timeout) {
	$scope.GoToEdit = function(id) {$location.path("/clase/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/clase/new");};
	$scope.GoToBulk = function() {$location.path("/clase/bulk");};
	// currentDate
	var fullDate = new Date();
	var twoDigitMonth = (fullDate.getMonth() + 1)+"";if(twoDigitMonth.length==1)	twoDigitMonth="0" +twoDigitMonth;
	var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1)	twoDigitDate="0" +twoDigitDate;
	var currentDate = fullDate.getFullYear() + "-" + twoDigitMonth + "-" +  twoDigitDate;
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
		total: 0,           				// length of data
		counts: clasePageSizes,				// page size buttons
		groupBy: claseDefaultGroupingBy,
		groupOptions: {isExpanded: true},
		getData: function(params) {
			// ajax request to api
			startLoading();
			return Api.index().$promise.then(function(data) {
				angular.forEach(data, function(value, key) {
					data[key]["instructor_nombre_completo"] = value.instructor.nombre_completo;
					data[key]["cant_users"] = value.users.length+" / "+value.max_users;
					data[key]["fecha_fixed"] = dateFormat(value.fecha) ;
					data[key]["dia"] = dayNames[(new Date(value.fecha+'T12:00:00Z')).getDay()];
				});
				$scope.clases = data;
				// Filter & Sort
				filteredData = params.filter() ? $filter('filter')(data, params.filter()): data;	
				orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				// set Page for current date
				$.each(orderedData,function(idx, val){if (val['fecha'] == currentDate) {params.page(Math.floor(idx/params.count()));return false;}});
				// Show
				params.total(orderedData.inlineCount);
				stopLoading();
				return orderedData;
			});
		}
    });
	// test_emails
	$scope.test_emails = function(id) {
		ResourceClase.test_emails();
	};
	// Reload button
	$scope.reloadTable = function(id) {
		$scope.tableParams.reload();
	};
	$scope.toDestroy = "";
	// Destroy
	$scope.toDestroy = function(clase_id) {
		$scope.IdToDestroy = clase_id;
	};
	$scope.destroyClase = function() {
		$rootScope.got_to_url_success = "/clase/index";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$.each($scope.clases, function(index) {
				if($scope.clases[index]!=undefined && $scope.clases[index].id == $scope.IdToDestroy) { //Remove from array
					ResourceClase.destroy($scope.deleteVariablesClaseToSend($scope.clases[index],true,true), $scope.callbackSuccess, $scope.callbackFailure);
					$scope.tableParams.reload();
				}    
			});
		})
	};
}]);















