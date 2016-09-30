// start APP
angular.module("TurnosApp",['ngRoute','ngResource','ngTable']).run(['$rootScope','$location',function($rootScope,$location) {
	// callbackSuccess
	$rootScope.callbackSuccess = function(response) {
		console.log("success", response); if(!$rootScope.got_to_url_success){$rootScope.got_to_url_success="/";}
		$location.path($rootScope.got_to_url_success);
		return true
	}
	// callbackFailure
	$rootScope.callbackFailure = function(response) {
		window.scrollTo(0, 0);
		console.log("failure", response);
		return true
	}
	// deleteVariablesClaseToSend
	$rootScope.deleteVariablesClaseToSend = function(clase,instructor,users) {
		if(instructor){delete clase.instructor;}if(users){delete clase.users;}
		delete clase.reemplazo;delete clase.created_at;delete clase.updated_at;delete clase.trialable;delete clase.cancelada;delete clase.cant_users;delete clase.fecha_fixed;
		return clase
	}
	//condicionesClases
	$rootScope.condicionesClases = function(clases,alumno) {
		// Each clase:
		alumno.actividad_counter = []; // Count clases for each actividad
		alumno.selected_counter = []; // Count clases for each checkbox
		$.each(clases, function(index_clase, clase) {
			// joined?
			if(jQuery.isEmptyObject( $.grep(clase.users, function(e){ return e.id == alumno.id; }))){	clases[index_clase].joined = false;
			}else{																						clases[index_clase].joined = true;}
			// actividad_counter []
			pack = $.grep(alumno.packs, function(e){ return e.actividad_id == clases[index_clase].actividad_id; })[0];
			if(clases[index_clase].joined){
				if(pack==undefined||pack.noperiod){
					if (alumno.actividad_counter[clases[index_clase].actividad_id] == undefined){	alumno.actividad_counter[clases[index_clase].actividad_id] = 1;
																									alumno.selected_counter[clases[index_clase].actividad_id] = 0;
					}else{																			alumno.actividad_counter[clases[index_clase].actividad_id] += 1;}
				}else{
					sd = new Date(pack.fecha_start+'T12:00:00Z');
					ed = new Date(pack.fecha_end+'T12:00:00Z');
					cd = new Date(events[key_event].fecha+'T12:00:00Z');
					if(cd>sd && ed>cd){
						if (alumno.actividad_counter[events[key_event].actividad_id] == undefined){	alumno.actividad_counter[events[key_event].actividad_id] = 1;
					}else{																			alumno.actividad_counter[events[key_event].actividad_id] += 1;}}
				}
			}
		});
		alumno.actividad_overquota = [];
		$.each(alumno.packs, function(key_packs, pack) {
			alumno.actividad_overquota[pack.actividad_id] = (pack.cantidad <= alumno.actividad_counter[pack.actividad_id])
		});
		return clases,alumno
	};
}]);
// Constants
var ActividadIndexDefault = 0; // Pilates
var InstructorIndexDefault = 0; // Victoria Barnfather
monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
monthNamesShort = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
dayNamesShort = ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
dayNamesMin = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
// datepicker settings
$.datepicker.regional['es'] = {
	 closeText: 'Cerrar',
	 prevText: '<Ant',
	 nextText: 'Sig>',
	 currentText: 'Hoy',
	 monthNames: monthNames,
	 monthNamesShort: monthNamesShort,
	 dayNames: dayNames,
	 dayNamesShort: dayNamesShort,
	 dayNamesMin: dayNamesMin,
	 weekHeader: 'Sm',
	 dateFormat: 'dd/mm/yy',
	 firstDay: 1,
	 isRTL: false,
	 showMonthAfterYear: false,
	 yearSuffix: ''
 };
 $.datepicker.setDefaults($.datepicker.regional['es']);
 $.datepicker.setDefaults({
	showOtherMonths: true,
	selectOtherMonths: true,
	dateFormat: "yy-mm-dd",
	changeMonth: true,
	changeYear: true,
	yearRange: "-80:+0",
	//showButtonPanel: true
});
//  Agenda
var claseAgendaDefaultPage = 1;	var claseAgendaDefaultCount = 5;
var claseAgendaDefaultFilter = {};   
var claseAgendaDefaultGroupingBy = 'fecha'; var claseAgendaDefaultGrouping = {fecha: "asc"}
var claseAgendaDefaultSorting = {fecha: 'desc',horario: 'asc'};
var claseAgendaPageSizes = [5, 15, 25, 50, 100];
var columns_claseAgenda = [
	{title:"Fecha",field:"fecha",filter:"fecha",visible:false,filter:{'fecha':'text'}, sortable: "fecha", sortDirection: "asc",groupable:"fecha",hiddenxs:false},
	{title:"Horario",field:"horario",filter:"horario",visible:true,filter:{'horario':'text'}, sortable: "horario", sortDirection: "desc",groupable:"horario",hiddenxs:false},
	{title:"Actividad",field:"actividad",filter:"actividad",visible:true,filter:{'actividad':'text'}, sortable: "actividad", sortDirection: "desc",groupable:"actividad",hiddenxs:false},
	{title:"Instructor",field:"instructor",filter:"instructor",visible:true,filter:{'instructor':'text'}, sortable: "instructor", sortDirection: "desc",groupable:"instructor",hiddenxs:false},
	{title:"Duración",field:"duracion",filter:"duracion",visible:true,filter:{'duracion':'text'}, sortable: "duracion", sortDirection: "desc",groupable:"duracion",hiddenxs:true},
];
//  Mis Clases
var claseMisClasesDefaultPage = 1;	var claseMisClasesDefaultCount = 15;
var claseMisClasesDefaultFilter = {};
var claseMisClasesDefaultSorting = {fecha: 'desc',horario: 'asc'};
var claseMisClasesPageSizes = [15, 25, 50, 100];
var columns_claseMisClases = [
	{title:"Fecha",field:"fecha_fixed",filter:"fecha_fixed",visible:true,filter:{'fecha_fixed':'text'}, sortable: "fecha", sortDirection: "asc",hiddenxs:false},
	{title:"Horario",field:"horario",filter:"horario",visible:true,filter:{'horario':'text'}, sortable: "horario", sortDirection: "desc",hiddenxs:false},
	{title:"Actividad",field:"actividad",filter:"actividad",visible:true,filter:{'actividad':'text'}, sortable: "actividad", sortDirection: "desc",hiddenxs:true},
	{title:"Instructor",field:"instructor",filter:"instructor",visible:true,filter:{'instructor':'text'}, sortable: "instructor", sortDirection: "desc",hiddenxs:false},
];
// Clase
var claseDefaultPage = 1;	var claseDefaultCount = 15;
var claseDefaultFilter = {};   
var claseDefaultGroupingBy = 'fecha'; var claseDefaultGrouping = {fecha: "desc"}
var claseDefaultSorting = {fecha: 'desc',horario: 'asc'};
var clasePageSizes = [15, 25, 50, 100];
var horariosArray = ["09:00","10:00","11:00","12:00","13:00","17:00","18:00","19:00","20:00","21:00","--","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];
var columns_clase = [
	{title:"Fecha",field:"fecha",filter:"fecha",visible:true,filter:{'fecha':'text'}, sortable: "fecha", sortDirection: "asc",groupable:"fecha"},
	{title:"Horario",field:"horario",filter:"horario",visible:true,filter:{'horario':'text'}, sortable: "horario", sortDirection: "desc",groupable:"horario"},
	{title:"Actividad",field:"actividad",filter:"actividad",visible:true,filter:{'actividad':'text'}, sortable: "actividad", sortDirection: "desc",groupable:"actividad"},
	{title:"Instructor",field:"instructor",filter:"instructor",visible:true,filter:{'instructor':'text'}, sortable: "instructor", sortDirection: "desc",groupable:"instructor"},
	{title:"Día",field:"dia",filter:"dia",visible:false,filter:{'dia':'text'}, sortable: "dia", sortDirection: "desc",groupable:"dia"},
	{title:"Duración",field:"duracion",filter:"duracion",visible:true,filter:{'duracion':'text'}, sortable: "duracion", sortDirection: "desc",groupable:"duracion"},
	{title:"Alumnos",field:"cant_users",filter:"cant_users",visible:true,filter:{'cant_users':'text'}, sortable: "cant_users", sortDirection: "desc",groupable:"cant_users"},
	{title:"Max.Alumnos",field:"max_users",filter:"max_users",visible:false,filter:{'max_users':'text'}, sortable: "max_users", sortDirection: "desc",groupable:"max_users"},
	{title:"Cancelada?",field:"cancelada",filter:"cancelada",visible:true,filter:{'cancelada':'text'}, sortable: "cancelada", sortDirection: "desc",groupable:"cancelada"},
	{title:"Prueba?",field:"trialable",filter:"trialable",visible:true,filter:{'trialable':'text'}, sortable: "trialable", sortDirection: "desc",groupable:"trialable"},
	{title:"Comentarios",field:"comment",filter:"comment",visible:false,filter:{'comment':'text'}, sortable: "comment", sortDirection: "desc",groupable:"comment"},
];
// Instructor
var claseInstructorPage = 1;	var claseInstructorCount = 15;
var claseInstructorFilter = {};
var claseInstructorSorting = {fecha: 'asc',horario: 'asc'};
var clasePageSizes = [15, 25, 50, 100];
var columns_instructor = [
	{title:"Fecha",field:"fecha_fixed",filter:"fecha",visible:true,filter:{'fecha':'text'}},
	{title:"Horario",field:"horario",filter:"horario",visible:true,filter:{'horario':'text'}},
	{title:"Alumnos",field:"cant_users",filter:"cant_users",visible:true,filter:{'cant_users':'text'}, sortable: "cant_users", sortDirection: "desc",groupable:"cant_users"},
	{title:"Alumnos",field:"users",filter:"users",visible:true,filter:{'users':'text'}, sortable: "users", sortDirection: "desc",groupable:"users"},
];
// Alumno
var alumnoDefaultPage = 1;	var alumnoDefaultCount = 25;
var alumnoDefaultFilter = {}; 
var alumnoDefaultGroupingBy = 'fecha'; var alumnoDefaultGrouping = {fecha: "desc"}
var alumnoDefaultSorting = {email: 'asc'};
var sexosArray = ["Mujer","Hombre"];
var columns_alumno = [
	{title:"Email",field:"email",filter:"email",visible:true,filter:{'email':'text'}},
	{title:"DNI",field:"dni",filter:"dni",visible:false,filter:{'dni':'text'}},
	{title:"Nombre",field:"nombre",filter:"nombre",visible:true,filter:{'nombre':'text'}},
	{title:"Apellido",field:"apellido",filter:"apellido",visible:true,filter:{'apellido':'text'}},
	{title:"Profesión",field:"profesion",filter:"profesion",visible:false,filter:{'profesion':'text'}},
	{title:"Fecha de nacimiento",field:"fechanac",filter:"fechanac",visible:false,filter:{'fechanac':'text'}},
	{title:"Fecha de inicio",field:"fechaini",filter:"fechaini",visible:false,filter:{'fechaini':'text'}},
	{title:"Teléfono",field:"telefono",filter:"telefono",visible:true,filter:{'telefono':'text'}},
	{title:"Domicilio",field:"domicilio",filter:"domicilio",visible:false,filter:{'domicilio':'text'}},
	{title:"Localidad",field:"localidad",filter:"localidad",visible:false,filter:{'localidad':'text'}},
	{title:"Nombre de contacto",field:"nombre_contacto",filter:"nombre_contacto",visible:false,filter:{'nombre_contacto':'text'}},
	{title:"Apellido de contacto",field:"apellido_contacto",filter:"apellido_contacto",visible:false,filter:{'apellido_contacto':'text'}},
	{title:"Teléfono de contacto",field:"telefono_contacto",filter:"telefono_contacto",visible:false,filter:{'telefono_contacto':'text'}},
	{title:"Sexo",field:"sexo",filter:"sexo",visible:true,filter:{'sexo':'text'}},
	{title:"Registro confirmado?",field:"confirmed",filter:"confirmed",visible:false,filter:{'confirmed':'text'}},
	{title:"Primera clase?",field:"primera_clase",filter:"primera_clase",visible:true,filter:{'primera_clase':'text'}},
	{title:"Admin?",field:"admin",filter:"admin",visible:true,filter:{'admin':'text'}},
];
// Actividad
var actividadDefaultPage = 1;	var actividadDefaultCount = 25;
var actividadDefaultFilter = {}; 
var actividadDefaultSorting = {nombre: 'desc'};
var columns_actividad = [
	{title:"Nombre",field:"nombre",filter:"nombre",visible:true,filter:{'nombre':'text'}},
];
