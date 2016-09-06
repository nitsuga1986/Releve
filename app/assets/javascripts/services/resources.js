// Clase
angular.module("TurnosApp").factory("ResourceClase",['$resource', function($resource) {
  return $resource("/api/clases/:id", { id: "@id" },
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' },
      'join':    { method: 'GET', isArray: false, url: '/api/clases/:id/join' },
      'unjoin':    { method: 'GET', isArray: false, url: '/api/clases/:id/unjoin' },
      'bulk':    { method: 'POST', isArray: false, url: '/api/clases/bulk' },
    }
  );
}]);
// User
angular.module("TurnosApp").factory("ResourceAlumno",['$resource', function($resource) {
  return $resource("/api/alumnos/:id", { id: "@id" },
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' },
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
