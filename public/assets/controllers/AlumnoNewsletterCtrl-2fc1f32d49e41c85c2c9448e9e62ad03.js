angular.module("TurnosApp").controller("AlumnoNewsletterCtrl",['$scope', '$rootScope', '$routeParams', '$location', 'ResourceAlumno', function($scope, $rootScope, $routeParams, $location, ResourceAlumno) {
	$scope.alumno = {}
	$scope.recipients_list = []
	$scope.alumno.recipient = "test";
	// SUBMIT
	$scope.submit = function() {
		if ($scope.alumno.mail_subject!=undefined && $scope.alumno.mail_title!=undefined && $scope.alumno.mail_body!=undefined){
			$rootScope.got_to_url_success = "/alumno/newsletter";
			if($scope.alumno.recipient=="list"){$scope.alumno.recipient = $scope.recipients_list.join();}
			ResourceAlumno.newsletter($scope.alumno, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
				$scope.show_formsuccess=true;$scope.show_formerror=false;
			});

		}else{$scope.show_formerror=true;$scope.show_formsuccess=false;}
		window.scrollTo(0, 0);
	};


	// Autocomplete
	$(function() {
		$( "#search_user" ).autocomplete({
			source: '/api/alumnos/autocomplete',
			minLength: 2,
			select: function( event, ui ) {
				if($.inArray(ui.item.email, $scope.recipients_list)==-1){
					$scope.recipients_list.push(ui.item.email);
				}
				$scope.$apply();
				$(this).val("");
				return false;
			}
		});
	});
	// removeFromList
	$scope.removeFromList = function(index) {
		$scope.recipients_list.splice(index, 1);
	};
	
	// utilizarPlantilla
	$scope.utilizarPlantilla = function(index) {
		if(index==0){
			$scope.alumno.mail_subject = "Reservá tus clases de MES";
			$scope.alumno.mail_title = "Reservá tu lugar!";
			$scope.alumno.mail_body = " Ya están disponibles las clases de MES, ¡agendá tu mes!\n\nHasta el HASTA, agendá sólo tus horarios regulares ya acordados con tu instructora.\n\nA partir del DESDE, podés modificar tus clases según disponibilidad en el sistema. ";
			$scope.alumno.mail_button_text = "Planificar hoy!";
			$scope.alumno.mail_button_link = "http://www.relevepilates.com.ar/app/planificar";
			$scope.alumno.mail_subtitle = "";
			$scope.alumno.mail_subbody = "";
			$scope.alumno.include_reminder = true;
		}
	};


stopLoading();}]);
