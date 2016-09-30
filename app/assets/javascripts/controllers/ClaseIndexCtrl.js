angular.module("TurnosApp").controller("ClaseIndexCtrl",['$scope', '$rootScope', '$location', 'ResourceClase', '$filter','NgTableParams', '$timeout', function($scope, $rootScope, $location, ResourceClase, $filter, NgTableParams, $timeout) {
	$scope.GoToEdit = function(id) {$location.path("/clase/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/clase/new");};
	$scope.GoToBulk = function() {$location.path("/clase/bulk");};
	firstload=true;
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
					data[key]["cant_users"] = value.users.length+" / "+value.max_users;
					data[key]["fecha_fixed"] = dateFormat(value.fecha) ;
				});
				$scope.clases = data;
				// Filter & Sort
				if($scope.filterDay.every(function(element,index){return element===[false,false,false,false,false,false,false][index];})){data=[];}
				dayData = jQuery.grep(data,function(clase){return $scope.dayCriteria.indexOf(clase.dia) !== -1;});
				filteredData = params.filter() ? $filter('filter')(dayData, params.filter()): dayData;	
				orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				// set Page for current date
				if(firstload){$.each(orderedData,function(idx, val){if (val['fecha'] == currentDate) {params.page(Math.floor(idx/params.count()));return false;}});firstload=false;}
				// Show
				params.total(orderedData.length);
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
	// filterDay
	$scope.dayCriteria = dayNames;
	$scope.filterDay=[true,true,true,true,true,true,true];
	$scope.filterAll=true;
	filterDaychangeAllClass = function() {
		if($scope.filterDay.every(function(element,index){return element===[true,true,true,true,true,true,true][index];})){
				$( "button.changeAll > i" ).removeClass('fa-square-o').addClass('fa-square'); return true
		}else{	$( "button.changeAll > i" ).removeClass('fa-square').addClass('fa-square-o');return false
	}};
	changeDayCriteria = function() {
		dayCriteria=[]; 
		angular.forEach(dayNames,function(value,key){
			if($scope.filterDay[key]){
				dayCriteria.push(dayNames[key])
			}
			$scope.dayCriteria=dayCriteria;
		});
		$scope.tableParams.page(1);
	};
	$scope.filterDaychangeAll = function() {
		startLoading();
		if(filterDaychangeAllClass()){$scope.filterDay=[false,false,false,false,false,false,false]}
		else{$scope.filterDay=[true,true,true,true,true,true,true]};
		changeDayCriteria();
		filterDaychangeAllClass();
		$scope.tableParams.reload();
	};
	$scope.filterDaychange = function(day) {
		startLoading();
		$scope.filterDay[day] = !$scope.filterDay[day];
		changeDayCriteria();
		filterDaychangeAllClass();
		$('button.filterDayButton').blur();
		$scope.tableParams.reload();
	};
}]);















