json.array! @pagos do |pago|
  json.(pago, :id, :monto, :mes, :cant_clases, :fecha)
  json.actividad pago.actividad.nombre
  json.alumno pago.user.nombre_completo
end
