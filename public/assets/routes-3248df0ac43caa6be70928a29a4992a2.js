// ROUTING ================================================
angular.module("TurnosApp")
	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
		// Api 
		.when("/app/mi_info", { title: 'Mi info',templateUrl: "/assets/usr/usr_mi_info.html ", controller: "UsrMiInfoCtrl", activetab: 'clase'})
		.when("/app/mis_clases", { title: 'Mis Clases',templateUrl: "/assets/usr/usr_mis_clases.html ", controller: "UsrMisClasesCtrl", activetab: 'clase'})
		.when("/app/planificar", { title: 'Planificar mis horarios',templateUrl: "/assets/usr/usr_planificar.html ", controller: "UsrPlanificarCtrl", activetab: 'clase'})
		.when("/app/agenda", { title: 'Agenda',templateUrl: "/assets/usr/usr_agenda.html ", controller: "UsrAgendaCtrl", activetab: 'clase'})
		.when("/app/", {  redirectTo: "/app/agenda" })
		// Clases
		.when("/clase/index", { title: 'Listado de clases',templateUrl: "/assets/clase/index.html ", controller: "ClaseIndexCtrl", activetab: 'clase'})
		.when("/clase/new", { title: 'Nueva clase',templateUrl: "/assets/clase/edit.html ", controller: "ClaseEditCtrl", activetab: 'clase'})
		.when("/clase/modificaciones", { title: 'Modificaciones de Agenda',templateUrl: "/assets/clase/modificaciones.html ", controller: "ClaseModificacionesCtrl", activetab: 'clase'})
		.when("/clase/bulk", { title: 'Agregar en cantidad',templateUrl: "/assets/clase/bulk.html ", controller: "ClaseBulkCtrl", activetab: 'clase'})
		.when("/clase/edit_bulk", { title: 'Editar en cantidad',templateUrl: "/assets/clase/edit_bulk.html ", controller: "ClaseEditBulkCtrl", activetab: 'clase'})
		.when("/clase/instructor", { title: 'Clases por instructor',templateUrl: "/assets/clase/instructor.html ", controller: "ClaseInstructorCtrl", activetab: 'clase'})
		.when("/clase/dashboard", { title: 'Panel de clases',templateUrl: "/assets/clase/dashboard.html ", controller: "ClaseDashboardCtrl", activetab: 'clase'})
		.when("/clase/:id", { title: 'Detalles de la clase',templateUrl: "/assets/clase/show.html ", controller: "ClaseShowCtrl", activetab: 'clase'})
		.when("/clase/:id/edit", { title: 'Editar clase',templateUrl: "/assets/clase/edit.html ", controller: "ClaseEditCtrl", activetab: 'clase'})
		// Alumnos 
		.when("/alumno/index", { title: 'Listado de alumnos',templateUrl: "/assets/alumno/index.html ", controller: "AlumnoIndexCtrl", activetab: 'alumno'})
		.when("/alumno/new", { title: 'Nuevo alumno',templateUrl: "/assets/alumno/edit.html ", controller: "AlumnoEditCtrl", activetab: 'alumno'})
		.when("/alumno/newsletter", { title: 'Enviar novedades',templateUrl: "/assets/alumno/newsletter.html ", controller: "AlumnoNewsletterCtrl", activetab: 'alumno'})
		.when("/alumno/:id", { title: 'Detalles de la alumno',templateUrl: "/assets/alumno/show.html ", controller: "AlumnoShowCtrl", activetab: 'alumno'})
		.when("/alumno/:id/edit", { title: 'Editar alumno',templateUrl: "/assets/alumno/edit.html ", controller: "AlumnoEditCtrl", activetab: 'alumno'})
		// Actividad 
		.when("/actividad/index", { title: 'Listado de actividades',templateUrl: "/assets/actividad/index.html ", controller: "ActividadIndexCtrl", activetab: 'actividad'})
		.when("/actividad/new", { title: 'Nuevo actividad',templateUrl: "/assets/actividad/edit.html ", controller: "ActividadEditCtrl", activetab: 'actividad'})
		.when("/actividad/:id", { title: 'Detalles de la actividad',templateUrl: "/assets/actividad/show.html ", controller: "ActividadShowCtrl", activetab: 'actividad'})
		.when("/actividad/:id/edit", { title: 'Editar actividad',templateUrl: "/assets/actividad/edit.html ", controller: "ActividadEditCtrl", activetab: 'actividad'})
		// Pago 
		.when("/pago/index", { title: 'Listado de pagos',templateUrl: "/assets/pago/index.html ", controller: "PagoIndexCtrl", activetab: 'pago'})
		.when("/pago/new", { title: 'Nuevo pago',templateUrl: "/assets/pago/edit.html ", controller: "PagoEditCtrl", activetab: 'pago'})
		.when("/pago/:id", { title: 'Detalles de la pago',templateUrl: "/assets/pago/show.html ", controller: "PagoShowCtrl", activetab: 'pago'})
		.when("/pago/:id/edit", { title: 'Editar pago',templateUrl: "/assets/pago/edit.html ", controller: "PagoEditCtrl", activetab: 'pago'})
		// Event 
		.when("/eventos/index", { title: 'Listado de eventos',templateUrl: "/assets/event/index.html ", controller: "EventIndexCtrl", activetab: 'event'})
		// Otros
		.otherwise({ redirectTo: "/" });
		// Fixes # in the routes. Not in IE...
		if (window.history && window.history.pushState) {
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: true,
				rewriteLinks: true
			});
		}
		else {
			$locationProvider.html5Mode(false);
		}
}])

// AngularJS Interceptor
//The following AngularJS Interceptor can be used to globally handle any 401 error, and handle them by redirecting the user to the /login page.
.factory('authHttpResponseInterceptor',['$q','$location','$window',function($q,$location,$window){ 
    return {
        response: function(response){
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401",rejection);
                $window.location.href = '/users/sign_in';
            }
            return $q.reject(rejection);
        }
    }
}])
.config(['$httpProvider',function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
}]);	

// Title
angular.module("TurnosApp").run(['$location', '$rootScope', function($location, $rootScope) {
	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		if(current.$$route.title!=undefined&&current.$$route.title!=''){
			$rootScope.title = " | "+current.$$route.title;
			document.title = document.title+$rootScope.title;
		}
		$rootScope.activetab = current.$$route.activetab;
	});
}]);

// Fix
angular.module("TurnosApp").config(['$httpProvider',function($httpProvider) {
	$httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);
