angular.module("TurnosApp").controller("AlumnoNewsletterCtrl",['$scope', '$rootScope', '$routeParams', '$location', 'ResourceAlumno', function($scope, $rootScope, $routeParams, $location, ResourceAlumno) {
	$scope.alumno = {}
	$scope.alumno.recipient = "test";
	// SUBMIT
	$scope.submit = function() {
		if ($scope.alumno.mail_subject!=undefined && $scope.alumno.mail_title!=undefined && $scope.alumno.mail_body!=undefined){
			$rootScope.got_to_url_success = "/alumno/newsletter";
			ResourceAlumno.newsletter($scope.alumno, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
				$scope.show_formsuccess=true;$scope.show_formerror=false;
			});

		}else{$scope.show_formerror=true;$scope.show_formsuccess=false;}
		window.scrollTo(0, 0);
	};

stopLoading();}]);
