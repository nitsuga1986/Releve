// Clase
angular.module("TurnosApp").factory("ResourceClase",['$resource', function($resource) {
  return $resource("/api/clases/:id", { id: "@id" },
    {
      'create':  			{ method: 'POST' },
      'index':   			{ method: 'GET', isArray: true, cache : true },
      'show':    			{ method: 'GET', isArray: false },
      'update':  			{ method: 'PUT' },
      'destroy': 			{ method: 'DELETE' },
      'join':    			{ method: 'POST', isArray: false, url: '/api/clases/:id/join' },
      'join_multiple': 		{ method: 'POST', isArray: false, url: '/api/clases/join_multiple' },
      'unjoin_usr_multiple':{ method: 'POST', isArray: false, url: '/api/clases/unjoin_usr_multiple' },
      'join_usr_multiple':  { method: 'POST', isArray: false, url: '/api/clases/join_usr_multiple' },
      'edit_asistencias':  	{ method: 'POST', isArray: false, url: '/api/clases/edit_asistencias' },
      'confirm':  			{ method: 'POST', isArray: false, url: '/api/clases/confirm' },
      'unconfirm':  		{ method: 'POST', isArray: false, url: '/api/clases/unconfirm' },
      'waitlist':    		{ method: 'POST', isArray: false, url: '/api/clases/:id/waitlist' },
      'unjoin':  			{ method: 'POST', isArray: false, url: '/api/clases/:id/unjoin' },
      'bulk':    			{ method: 'POST', isArray: false, url: '/api/clases/bulk' },
      'edit_bulk':    		{ method: 'POST', isArray: false, url: '/api/clases/edit_bulk' },
      'index_instructor':  	{ method: 'POST', isArray: true, url: '/api/clases/index_instructor' },
      'index_current': 		{ method: 'GET', isArray: true, url: '/api/clases/index_current', cache : true },
      'index_user': 		{ method: 'GET', isArray: true, url: '/api/clases/index_user'},
      'history_usr':  		{ method: 'GET', isArray: true, url: '/api/clases/history_usr', cache : true },
    }
  );
}]);

// User
angular.module("TurnosApp").factory("ResourceAlumno",['$resource', function($resource) {
  return $resource("/api/alumnos/:id", { id: "@id" },
    {
      'create':  		{ method: 'POST' },
      'index':   		{ method: 'GET', isArray: true },
      'show':    		{ method: 'GET', isArray: false },
      'update':  		{ method: 'PUT' },
      'update_current': { method: 'PUT', isArray: false, url: '/api/alumnos/update_current' },
      'destroy': 		{ method: 'DELETE' },
      'current': 		{ method: 'POST', isArray: false, url: '/api/alumnos/current' },
      'instructores': 	{ method: 'POST', isArray: true, url: '/api/alumnos/instructores' },
      'newsletter': 	{ method: 'POST', isArray: false, url: '/api/alumnos/newsletter' },
    }
  );
}]);

// Actividad
angular.module("TurnosApp").factory("ResourceActividad",['$resource', function($resource) {
  return $resource("/api/actividad/:id", { id: "@id" },
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' },
    }
  );
}]);

// Pago
angular.module("TurnosApp").factory("ResourcePago",['$resource', function($resource) {
  return $resource("/api/pago/:id", { id: "@id" },
    {
      'create':  		{ method: 'POST' },
      'index':   		{ method: 'GET', isArray: true },
      'show':    		{ method: 'GET', isArray: false },
      'update':  		{ method: 'PUT' },
      'destroy': 		{ method: 'DELETE' },
      'index_user': 	{ method: 'GET', isArray: true, url: '/api/pago/index_user'},
    }
  );
}]);

// Event
angular.module("TurnosApp").factory("ResourceEvent",['$resource', function($resource) {
  return $resource("/api/event/:id", { id: "@id" },
    {
      'index':   { method: 'GET', isArray: true },
      'stats': 	{ method: 'POST', isArray: false, url: '/api/event/stats'},
    }
  );
}]);
