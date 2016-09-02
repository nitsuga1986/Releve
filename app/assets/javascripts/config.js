// start APP
angular.module("TurnosApp",['ngRoute','ngResource','ngTable']);
// datepicker settings
$.datepicker.regional['es'] = {
	 closeText: 'Cerrar',
	 prevText: '<Ant',
	 nextText: 'Sig>',
	 currentText: 'Hoy',
	 monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	 monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
	 dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
	 dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
	 dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
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
	//showButtonPanel: true
});
// Clase
var claseDefaultPage = 1;	var claseDefaultCount = 100;
var claseDefaultFilter = {}; 
var claseDefaultSorting = {fecha: 'desc',horario: 'desc'};
var horariosArray = ["09:00","10:00","11:00","12:00","13:00","17:00","18:00","19:00","20:00","21:00","--","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];
var columns_clase = [
	{title:"Día",field:"dia",filter:"dia",visible:true,filter:{'dia':'text'}},
	{title:"Fecha",field:"fecha",filter:"fecha",visible:true,filter:{'fecha':'text'}},
	{title:"Horario",field:"horario",filter:"horario",visible:true,filter:{'horario':'text'}},
	{title:"Actividad",field:"actividad",filter:"actividad",visible:true,filter:{'actividad':'text'}},
	{title:"Instructor",field:"instructor",filter:"instructor",visible:true,filter:{'instructor':'text'}},
	{title:"Alumnos",field:"cant_users",filter:"cant_users",visible:true,filter:{'cant_users':'text'}},
	{title:"Max.Alumnos",field:"max_users",filter:"max_users",visible:false,filter:{'max_users':'text'}},
	{title:"Cancelada?",field:"cancelada",filter:"cancelada",visible:true,filter:{'cancelada':'text'}},
	{title:"Comentarios",field:"comment",filter:"comment",visible:false,filter:{'comment':'text'}},
	{title:"Fecha de creación",field:"created_at",filter:"created_at",visible:false,filter:{'created_at':'text'}},
	{title:"Ùltima modificación",field:"updated_at",filter:"updated_at",visible:false,filter:{'updated_at':'text'}},
];
// Alumno
var alumnoDefaultPage = 1;	var alumnoDefaultCount = 100;
var alumnoDefaultFilter = {}; 
var alumnoDefaultSorting = {email: 'desc'};
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
	{title:"Registro confirmado?",field:"confirmed",filter:"confirmed",visible:true,filter:{'confirmed':'text'}},
	{title:"Primera clase?",field:"primera_clase",filter:"primera_clase",visible:true,filter:{'primera_clase':'text'}},
	{title:"# de clases",field:"nro_clases",filter:"nro_clases",visible:true,filter:{'nro_clases':'text'}},
	{title:"Admin?",field:"admin",filter:"admin",visible:true,filter:{'admin':'text'}},
];
