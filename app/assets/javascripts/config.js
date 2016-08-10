// Clase
var claseDefaultPage = 1;	var claseDefaultCount = 50;
var claseDefaultFilter = {}; 
var claseDefaultSorting = {fecha: 'desc'};
var horariosArray = ["8:00","10:00","10:30","11:00","12:30","16:00","17:30","17:00","19:00","20:00","20:30"];
var columns_clase = [
	{title:"Fecha",field:"fecha",filter:"fecha",visible:true,filter:{'fecha':'text'}},
	{title:"Horario",field:"horario",filter:"horario",visible:true,filter:{'horario':'text'}},
	{title:"Instructor",field:"instructor",filter:"instructor",visible:true,filter:{'instructor':'text'}},
	{title:"Max.Alumnos",field:"max_users",filter:"max_users",visible:true,filter:{'max_users':'text'}},
	{title:"Cancelada?",field:"cancelada",filter:"cancelada",visible:true,filter:{'cancelada':'text'}},
	{title:"Comentarios",field:"comment",filter:"comment",visible:false,filter:{'comment':'text'}},
	{title:"Fecha de creación",field:"created_at",filter:"created_at",visible:false,filter:{'created_at':'text'}},
	{title:"Ùltima modificación",field:"updated_at",filter:"updated_at",visible:false,filter:{'updated_at':'text'}},
];
