angular.module("TurnosApp").controller("AlumnoEditCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceAlumno', 'ResourceActividad', 'ResourceClase', 'ResourcePago', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceAlumno, ResourceActividad, ResourceClase, ResourcePago) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.sexosArray = sexosArray;
	$scope.submiterror = false;
	$scope.moreClasesButton = true;
	$scope.GoToEdit = function(id) {$location.path("/clase/"+id+"/edit/");};
	$scope.GoToPagoEdit = function(id) {$location.path("/pago/"+id+"/edit/");};
	$scope.history_GoToAlumnoEdit = []; // Prevents loop search
	$scope.GoToIndex = function(id) {$location.path("/alumno/index");};
	$scope.ActividadIndex = [];
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
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
		$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar cambios';
		$scope.alumno = ResourceAlumno.show({ id: $routeParams.id });
		$scope.clases = ResourceClase.index_user({ id: $routeParams.id, recent: true }).$promise.then(function( data ){
			angular.forEach(data, function(value, key) {
				data[key]["fecha_fixed"] = dateFormat(value.fecha);
				data[key]["confirmed"] = $.grep(value.users, function(e){ return e.id == $routeParams.id; })[0].confirmed;
				data[key]["asistencia_id"] = $.grep(value.users, function(e){ return e.id == $routeParams.id; })[0].asistencia_id;
			});
			$scope.clases = data;
		});
		$scope.pagos = ResourcePago.index_user({ id: $routeParams.id }).$promise.then(function( data ){
			angular.forEach(data, function(value, key) {
				data[key]["monto"] = '$'+value.monto;
				data[key]["mes"] = monthNames[value.mes-1];
			});
			$scope.pagos = data;
		});
		
		$scope.alumno.$promise.then(function( value ){
			$.each($scope.alumno.packs, function(index_pack, pack) {
				//AQUI
				if($.grep(pack.cantidad_array, function( a ) {return a !== 1;}).length !== 0){
					$scope.alumno.packs[index_pack]['active'] = true;
				}else{
					$scope.alumno.packs[index_pack]['active'] = false;
				};
			});
			ResourceActividad.index().$promise.then(function(ActividadIndex){
				$scope.ActividadIndex = ActividadIndex;
				$.each($scope.ActividadIndex, function(index_actividades) {
					notincluded = true;
					$.each($scope.alumno.packs, function(index_pack) {
						if($scope.ActividadIndex[index_actividades].id==$scope.alumno.packs[index_pack].actividad_id){notincluded=false;}
					});
					if(notincluded){
						missing_pack = {"actividad_id":$scope.ActividadIndex[index_actividades].id,"cantidad":null,"cantidad_array":[1,1,1,1,1,1,1,1,1,1,1,1],"noperiod":true,"fecha_start":null,"fecha_end":null,"actividad":$scope.ActividadIndex[index_actividades].nombre}
						$scope.alumno.packs.push(missing_pack);
					}
				});
			});
		},function( error ){$location.path("/alumno/new");});	// if id not exists => ToNew
	} else { 				// New
		$scope.FormTitle = "<i class='fa fa-user'></i> Agregar nuevo alumno";
		$scope.FormButton = '<i class="fa fa-alumno-plus fa-lg"></i> Agregar alumno';
		$scope.alumno = new ResourceAlumno();
		$scope.alumno.alumnos = [];
		$scope.alumno.fecha_inicio = $scope.SetToday();
		$scope.alumno.actividades = ResourceActividad.index();
	}
	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$scope.buttonDisabled = true;
		$rootScope.got_to_url_success = "/alumno/index";
		$scope.FormErrors = [];
		if ($scope.AlumnoForm.$valid) {
			console.log("valid submit");
			// Update or Create
			if ($routeParams.id) {
				ResourceAlumno.update($scope.alumno, $scope.callbackSuccess, $scope.callbackFailure);
			} else {
				ResourceAlumno.create($scope.alumno, $scope.callbackSuccess, $scope.callbackFailure); 	
			}
		} else {
			$scope.AlumnoForm.submitted = true;
			$scope.buttonDisabled = false;
			window.scrollTo(0, 0);
		}
	};
	// confirm - unconfirm
	$rootScope.got_to_url_success = "/alumno/"+$routeParams.id+"/edit/";
	$scope.confirmAsistencia = function(asistencia_id) {ResourceClase.confirm({'id':asistencia_id}, $scope.callbackSuccess, $scope.callbackFailure)};
	$scope.unconfirmAsistencia = function(asistencia_id) {ResourceClase.unconfirm({'id':asistencia_id}, $scope.callbackSuccess, $scope.callbackFailure)};
	// allClases
	$scope.allClases = function() {
		$scope.moreClasesButton = false;
		$scope.clases = ResourceClase.index_user({ id: $routeParams.id, recent: false }).$promise.then(function( data ){
			angular.forEach(data, function(value, key) {
				data[key]["fecha_fixed"] = dateFormat(value.fecha);
				data[key]["confirmed"] = $.grep(value.users, function(e){ return e.id == $routeParams.id; })[0].confirmed;
				data[key]["asistencia_id"] = $.grep(value.users, function(e){ return e.id == $routeParams.id; })[0].asistencia_id;
			});
			$scope.clases = data;
		});
	};
	// Delete Alumno
	$scope.DeleteAlumno = function(id) {
		$.each($scope.alumno.alumnos, function(index) {
			if($scope.alumno.alumnos[index]!=undefined && $scope.alumno.alumnos[index].id == id) { //Remove from array
				$scope.alumno.alumnos.splice(index, 1);
			}    
		});
	};
	// GoTo
  	$scope.GoToAlumnoEdit = function() {
		if($scope.history_GoToAlumnoEdit.indexOf($scope.alumno.email) == -1){
			if($scope.alumno.email!=undefined&&$scope.alumno.email!=null&&$scope.alumno.email!=''){
				$scope.history_GoToAlumnoEdit.push($scope.alumno.email);
				$http.get('/api/alumnos/search', {params: { email:$scope.alumno.email}}).
				success(function(data, status, headers, config) {
					if(data.id!=undefined){
						$location.path("/alumno/"+data.id+"/edit");
					}else{};
				});
			};
		};
	};
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fechanac" ).datepicker({
			defaultDate: "+0D",
			onSelect: function(dateText) {
				$scope.alumno.fechanac=dateText;
		   }
		});
	});
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fechaini" ).datepicker({
			defaultDate: "+0D",
			onSelect: function(dateText) {
				$scope.alumno.fechaini=dateText;
		   }
		});
	});
		
stopLoading();}]);
