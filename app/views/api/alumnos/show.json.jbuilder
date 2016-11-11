json.(@alumno, :id, :primera_clase, :email, :dni, :nombre, :apellido, :profesion, :fechanac,
:fechaini, :telefono, :domicilio, :localidad, :nombre_contacto, :apellido_contacto, :telefono_contacto,
:sexo, :reminders, :newsletter, :instructor, :confirmed, :admin)
json.packs @alumno.packs do |pack|
  json.id pack.id
  json.actividad_id pack.actividad_id
  json.actividad pack.actividad.nombre
  json.cantidad pack.cantidad
  json.fecha_start pack.fecha_start
  json.fecha_end pack.fecha_end
  json.noperiod pack.noperiod
end
