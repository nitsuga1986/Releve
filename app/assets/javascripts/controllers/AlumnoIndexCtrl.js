angular.module("TurnosApp").controller("AlumnoIndexCtrl",['$scope', '$location', 'ResourceAlumno', '$filter','ngTableParams', '$timeout', function($scope, $location, ResourceAlumno, $filter, ngTableParams, $timeout) {
	$scope.GoToEdit = function(id) {$location.path("/alumno/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/alumno/new");};
	// ngTable
	var Api = ResourceAlumno;
	$scope.columns_alumno = columns_alumno
	$scope.tableParams = new ngTableParams({
		page: alumnoDefaultPage,         	// initial first page
		count: alumnoDefaultCount,         	// initial count per page
		filter: alumnoDefaultFilter, 		// initial filter
		sorting: alumnoDefaultSorting 		// initial sorting
	}, {
		total: 0,           // length of data
		getData: function($defer, params) {
			// ajax request to api
			$scope.loading=true;
			Api.index({}, function(data) {
				// update table params
				$scope.alumnos = data;
				params.total(data.length);
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















