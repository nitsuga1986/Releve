json.(@user, :id, :nombre, :apellido, :email, :profesion, :dni, :telefono, :domicilio, :localidad, :fechanac, :sexo, :nombre_contacto, :apellido_contacto, :telefono_contacto, :reminders, :newsletter)
json.packs @user.packs do |pack|
  json.id pack.id
  json.actividad_id pack.actividad_id
  json.actividad pack.actividad.nombre
  json.cantidad pack.cantidad
  json.fecha_start pack.fecha_start
  json.fecha_end pack.fecha_end
  json.noperiod pack.noperiod
end
