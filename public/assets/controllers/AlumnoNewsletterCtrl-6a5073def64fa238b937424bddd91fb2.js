angular.module("TurnosApp").controller("AlumnoNewsletterCtrl",['$scope', '$rootScope', '$routeParams', '$location', 'ResourceAlumno', function($scope, $rootScope, $routeParams, $location, ResourceAlumno) {
	$scope.alumno = {}
	$scope.recipients_list = []
	$scope.alumno.recipient = "test";
	// SUBMIT
	$scope.submit = function() {
		$scope.buttonDisabled = true;
		if ($scope.alumno.mail_subject!=undefined && $scope.alumno.mail_title!=undefined && $scope.alumno.mail_body!=undefined){
			$rootScope.got_to_url_success = "/alumno/newsletter";
			if($scope.alumno.recipient=="list"){$scope.alumno.recipient = $scope.recipients_list.join();}
			ResourceAlumno.newsletter($scope.alumno, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
				$scope.show_formsuccess=true;$scope.show_formerror=false;$scope.buttonDisabled = false;
			});

		}else{$scope.show_formerror=true;$scope.show_formsuccess=false;$scope.buttonDisabled = false;}
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
		if(index==99){
			$scope.alumno.mail_subject = "";$scope.alumno.mail_title = "";$scope.alumno.mail_pretext = "";$scope.alumno.mail_body = "";
			$scope.alumno.mail_button_text = "";$scope.alumno.mail_button_link = "";$scope.alumno.mail_subtitle = "";$scope.alumno.mail_subbody = "";$scope.alumno.include_reminder = false;
		}
		if(index==0){
			$scope.alumno.mail_subject = "Reservá tus clases de MES";
			$scope.alumno.mail_title = "Reservá tu lugar!";
			$scope.alumno.mail_pretext = "Agendá tus clases esta semana y reservá tu lugar";
			$scope.alumno.mail_body = "Ya están disponibles las clases de Febrero, ¡agendá tu mes!\n\nHasta el 20 de Enero, agendá SÓLO tus horarios fijos ya acordados con tu instructora. Luego de esta fecha los horarios quedarán disponibles para todos los alumnos.\n\nA partir del 21 de Enero, podés modificar tus clases según la disponibilidad en el sistema. ";
			$scope.alumno.mail_button_text = "Planificar hoy!";
			$scope.alumno.mail_button_link = "http://www.relevepilates.com.ar/app/planificar";
			$scope.alumno.mail_subtitle = "";
			$scope.alumno.mail_subbody = "";
			$scope.alumno.include_reminder = true;
		}
		if(index==1){
			$scope.alumno.mail_subject = "No hemos recibido tu pago de MES";
			$scope.alumno.mail_title = "Pago de MES";
			$scope.alumno.mail_pretext = "Te recordamos que podés realizar el pago al contado en el estudio o realizar el depósito";
			$scope.alumno.mail_body = "Nos ponemos en contacto porque en nuestros registros, al día de la fecha, figuran impagas las clases del mes de MES.\n\nTe recordamos que las clases que no se cancelan con anticipación a través del sitio web deberán ser abonadas, ya que el lugar fue reservado aunque no haya sido tomado.\n\nEl monto adeudado es de MONTO correspondientes al combo de NRO clases del Mes de MES. El pago se puede realizar al contado o a través de depósito bancario.\n\nTe esperamos para regularizar tu situación y deseamos que puedas retomar tu entrenamiento pronto!";
			$scope.alumno.mail_button_text = "";
			$scope.alumno.mail_button_link = "";
			$scope.alumno.mail_subtitle = "";
			$scope.alumno.mail_subbody = "";
			$scope.alumno.include_reminder = false;
		}
		if(index==2){
			$scope.alumno.mail_subject = "Precios MES AÑO";
			$scope.alumno.mail_title = "Actualización de precios";
			$scope.alumno.mail_pretext = "A partir de MES se realizará un ajuste de precios. A continuación se detallan los nuevos precios de las clases grupales y privadas.";
			$scope.alumno.mail_body = "Queridos alumnos,\n\nDebido al aumento generalizado de precios de público conocimiento, los costos del estudio se han visto incrementados y por lo tanto se realizará un aumento de precios a partir del mes de MES.\n\nA continuación les informamos los nuevos precios:\n\nPilates: clases grupales\n\n1 vez x semana $PRECIO\n2 veces x semana $PRECIO\n3 veces x semana $PRECIO\n4 veces x semana $PRECIO\nClase suelta $PRECIO\n\n\nPilates: clases privadas\n\n1 vez x semana $PRECIO\n2 veces x semana$PRECIO\n3 veces x semana$PRECIO\nClase suelta $PRECIO\n\nReleve Pilates.";
			$scope.alumno.mail_button_text = "";
			$scope.alumno.mail_button_link = "";
			$scope.alumno.mail_subtitle = "";
			$scope.alumno.mail_subbody = "";
			$scope.alumno.include_reminder = false;
		}
		if(index==3){
			$scope.alumno.mail_subject = "No hemos recibido tu pago de MES";
			$scope.alumno.mail_title = "Pago de MES";
			$scope.alumno.mail_pretext = "Te recordamos que podés realizar el pago al contado en el estudio o realizar el depósito";
			$scope.alumno.mail_body = "Nos ponemos en contacto porque en nuestros registros, al día de la fecha, figuran impagas las clases del mes de MES.\n\nTe recordamos que las clases se abonan del 1 al 10 de cada mes. El pago se puede realizar al contado o a través de depósito bancario.\n\nTe esperamos!\n\nGracias,\nReleve Pilates.";
			$scope.alumno.mail_button_text = "";
			$scope.alumno.mail_button_link = "";
			$scope.alumno.mail_subtitle = "";
			$scope.alumno.mail_subbody = "";
			$scope.alumno.include_reminder = false;
		}
	};


stopLoading();}]);
