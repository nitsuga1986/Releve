//= require jquery-ui/datepicker
//= require jquery-ui/autocomplete
//= require angular/angular.min
//= require angular/angular-resource.min
//= require angular/angular-route.min
//= require angular/angular-cookies.min
//= require angular/ng-table.min
//= require chartjs/Chart.min
//= require angular-chart.js/angular-chart.min
//= require config
//= require filters/html_trusted
//= require directives/onFinishRender
//= require filters/true_false
//= require services/resources
//= require controllers/UsrMisClasesCtrl
//= require controllers/UsrAgendaCtrl
//= require controllers/UsrMiInfoCtrl
//= require controllers/UsrPlanificarCtrl
//= require controllers/UsrMiInfoCtrl
//= require controllers/ClaseIndexCtrl
//= require controllers/ClaseEditCtrl
//= require controllers/ClaseModificacionesCtrl
//= require controllers/ClaseInstructorCtrl
//= require controllers/ClaseDashboardCtrl
//= require controllers/ClaseBulkCtrl
//= require controllers/ClaseEditBulkCtrl
//= require controllers/ClaseShowCtrl
//= require controllers/AlumnoIndexCtrl
//= require controllers/AlumnoEditCtrl
//= require controllers/AlumnoShowCtrl
//= require controllers/AlumnoNewsletterCtrl
//= require controllers/ActividadIndexCtrl
//= require controllers/ActividadEditCtrl
//= require controllers/ActividadShowCtrl
//= require controllers/PagoIndexCtrl
//= require controllers/PagoEditCtrl
//= require controllers/PagoShowCtrl
//= require controllers/EventIndexCtrl
//= require controllers/EventStatsCtrl
//= require routes
// startLoading
function startLoading() {
	$('#AppContainer').fadeOut();
	$('#ReleveImgNav').hide();
	$('#LoadingImg').show();
}
// stopLoading
function stopLoading() {
	$('#LoadingImg').hide();
	$('#ReleveImgNav').show();
	$('#AppContainer').fadeIn();
}
// showErrorMessage
function showErrorMessage() {
	$('#defaultErrorAlert').show();
}
startLoading();
