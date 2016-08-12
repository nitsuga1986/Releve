angular.module("TurnosApp").controller("ClaseJoinCtrl", ['$scope', '$routeParams', '$location', 'ResourceClase', function($scope, $routeParams, $location, ResourceClase) {
	
$scope.clases = ResourceClase.index({ id: $routeParams.id });

function WeekDay(date) {
	var a = date.split("/");
	a = new Date(a[2],a[1]-1,a[0]).getDay();
	return (a); // 0 for sunday, 6 for saturday
}

}]);















