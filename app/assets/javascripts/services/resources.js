// Clase
angular.module("TurnosApp").factory("ResourceClase",['$resource', function($resource) {
  return $resource("/api/clases/:id", { id: "@id" },
    {
      'create':  		{ method: 'POST' },
      'index':   		{ method: 'GET', isArray: true, cache : true },
      'show':    		{ method: 'GET', isArray: false },
      'update':  		{ method: 'PUT' },
      'destroy': 		{ method: 'DELETE' },
      'join':    		{ method: 'POST', isArray: false, url: '/api/clases/:id/join' },
      'join_multiple':  { method: 'POST', isArray: false, url: '/api/clases/join_multiple' },
      'waitlist':    	{ method: 'POST', isArray: false, url: '/api/clases/:id/waitlist' },
      'unjoin':  		{ method: 'POST', isArray: false, url: '/api/clases/:id/unjoin' },
      'bulk':    		{ method: 'POST', isArray: false, url: '/api/clases/bulk' },
      'edit_bulk':    	{ method: 'POST', isArray: false, url: '/api/clases/edit_bulk' },
      'instructor':  	{ method: 'POST', isArray: true, url: '/api/clases/instructor' },
      'index_usr': 		{ method: 'GET', isArray: true, url: '/api/clases/index_usr', cache : true },
      'history_usr':  	{ method: 'GET', isArray: true, url: '/api/clases/history_usr', cache : true },
      'test_emails': 	{ method: 'GET', isArray: false, url: '/api/clases/test_emails'},
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
      'usr_clases': 	{ method: 'POST', isArray: true, url: '/api/alumnos/:id/usr_clases'},
    }
  );
}]);

// User
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
