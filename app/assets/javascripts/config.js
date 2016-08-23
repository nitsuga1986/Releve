// Clase
var claseDefaultPage = 1;	var claseDefaultCount = 50;
var claseDefaultFilter = {}; 
var claseDefaultSorting = {fecha: 'desc'};
var horariosArray = ["8:00","10:00","10:30","11:00","12:30","16:00","17:30","17:00","19:00","20:00","20:30"];
var columns_clase = [
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
var alumnoDefaultPage = 1;	var alumnoDefaultCount = 50;
var alumnoDefaultFilter = {}; 
var alumnoDefaultSorting = {email: 'desc'};
var columns_alumno = [
	{title:"email",field:"email",filter:"email",visible:true,filter:{'email':'text'}},
	{title:"dni",field:"dni",filter:"dni",visible:false,filter:{'dni':'text'}},
	{title:"nombre",field:"nombre",filter:"nombre",visible:true,filter:{'nombre':'text'}},
	{title:"apellido",field:"apellido",filter:"apellido",visible:true,filter:{'apellido':'text'}},
	{title:"profesion",field:"profesion",filter:"profesion",visible:false,filter:{'profesion':'text'}},
	{title:"fechanac",field:"fechanac",filter:"fechanac",visible:false,filter:{'fechanac':'text'}},
	{title:"fechaini",field:"fechaini",filter:"fechaini",visible:false,filter:{'fechaini':'text'}},
	{title:"telefono",field:"telefono",filter:"telefono",visible:true,filter:{'telefono':'text'}},
	{title:"domicilio",field:"domicilio",filter:"domicilio",visible:false,filter:{'domicilio':'text'}},
	{title:"localidad",field:"localidad",filter:"localidad",visible:false,filter:{'localidad':'text'}},
	{title:"nombre_contacto",field:"nombre_contacto",filter:"nombre_contacto",visible:false,filter:{'nombre_contacto':'text'}},
	{title:"apellido_contacto",field:"apellido_contacto",filter:"apellido_contacto",visible:false,filter:{'apellido_contacto':'text'}},
	{title:"telefono_contacto",field:"telefono_contacto",filter:"telefono_contacto",visible:false,filter:{'telefono_contacto':'text'}},
	{title:"sexo",field:"sexo",filter:"sexo",visible:true,filter:{'sexo':'text'}},
	{title:"confirmed",field:"confirmed",filter:"confirmed",visible:true,filter:{'confirmed':'text'}},
	{title:"primera_clase",field:"primera_clase",filter:"primera_clase",visible:true,filter:{'primera_clase':'text'}},
	{title:"nro_clases",field:"nro_clases",filter:"nro_clases",visible:true,filter:{'nro_clases':'text'}},
	{title:"admin",field:"admin",filter:"admin",visible:true,filter:{'admin':'text'}},
];
