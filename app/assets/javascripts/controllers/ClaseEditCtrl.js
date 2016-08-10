angular.module("TurnosApp").controller("ClaseEditCtrl",['$scope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', function($scope, $q, $http, $routeParams, $location, ResourceClase) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.submiterror = false;
	// SetToday
	$scope.SetToday = function(scope_date) {
		today = new Date();
		dd = today.getDate();if(dd<10){dd='0'+dd } 
		mm = today.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = today.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	// Edit or New
	if ($routeParams.id) { 	// Edit
		$scope.FormTitle = "<i class='fa fa-calendar'></i> Editar datos de la clase";
		$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar cambios';
		$scope.clase = ResourceClase.show({ id: $routeParams.id });
		$scope.clase.$promise.then(function( value ){},function( error ){$location.path("/clase/new");});	// if id not exists => ToNew
	} else { 				// New
		$scope.FormTitle = "<i class='fa fa-calendar'></i> Agregar nueva clase";
		$scope.FormButton = '<i class="fa fa-user-plus fa-lg"></i> Agregar clase';
		$scope.clase = new ResourceClase();
		$scope.clase.users = [];
		$scope.clase.fecha = $scope.SetToday()
	}
	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$scope.FormErrors = [];
		if ($scope.ClaseForm.$valid) {
			console.log("valid submit");
			// Success
			function success(response) {
				console.log("success", response);
				$location.path("/clase/"+response.id);
			}
			// Failure
			function failure(response) {
				$scope.submiterror = true;
				window.scrollTo(0, 0);
				console.log("failure", response)
				_.each(response.data, function(errors, key) {
					_.each(errors, function(e) {
						$scope.form[key].$dirty = true;
						$scope.form[key].$setValidity(e, false);
					});
				});
			}
			// Update or Create
			if ($routeParams.id) {
				ResourceClase.update($scope.clase, success, failure);
			} else {
				ResourceClase.create($scope.clase, success, failure); 	
			}
		} else {
			$scope.ClaseForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};
	// Delete User
	$scope.DeleteUser = function(id) {
		$.each($scope.clase.users, function(index) {
			if($scope.clase.users[index]!=undefined && $scope.clase.users[index].id == id) { //Remove from array
				$scope.clase.users.splice(index, 1);
			}    
		});
	};
	// Autocomplete
	$(function() {
		$( "#search_user" ).autocomplete({
			source: '/clase/autocomplete',
			minLength: 2,
			select: function( event, ui ) {
				$scope.clase.users = $scope.clase.users.concat(ui.item);
				$scope.$apply();
				$(this).val("");
				return false;
			}
		});
	});
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fecha" ).datepicker({
			defaultDate: "+0D",
			maxDate: "+0D",        
			onSelect: function(dateText) {
				$scope.clase.fecha=dateText;
				$scope.GoToClaseEdit();
		   }
		});
	});
		
}]);
