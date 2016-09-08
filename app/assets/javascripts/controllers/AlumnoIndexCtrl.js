angular.module("TurnosApp").controller("AlumnoIndexCtrl",['$scope', '$location', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceAlumno, $filter, NgTableParams, $timeout) {
	$scope.GoToEdit = function(id) {$location.path("/alumno/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/alumno/new");};
	// ngTable
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
	var Api = ResourceAlumno;
	$scope.columns_alumno = columns_alumno
	$scope.cant_visible_cols = $.grep(columns_alumno, function(e){ return e.visible == true; }).length+1;
    $scope.tableParams = new NgTableParams({
		page: alumnoDefaultPage,         	// initial first page
		count: alumnoDefaultCount,         	// initial count per page
		filter: alumnoDefaultFilter, 		// initial filter
		sorting: alumnoDefaultSorting 		// initial sorting
	}, {
		total: 0,           // length of data
		getData: function(params) {
			// ajax request to api
			return Api.index(params.url()).$promise.then(function(data) {
				$scope.alumnos = data;
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
		$location.path("/alumno/index");
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
	$scope.toDestroy = function(alumno_id) {
			console.log("alumno_id",alumno_id)
		$scope.IdToDestroy = alumno_id;
	};
	$scope.destroyAlumno = function() {
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$.each($scope.alumnos, function(index) {
				console.log("Alumno",$scope.alumnos[index])
				if($scope.alumnos[index]!=undefined && $scope.alumnos[index].id == $scope.IdToDestroy) { //Remove from array
					console.log("Alumnoindex",$scope.alumnos[index])
					ResourceAlumno.destroy($scope.alumnos[index], success, failure);
				}    
			});
		})
	};
}]);















