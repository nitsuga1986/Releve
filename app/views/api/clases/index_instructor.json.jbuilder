json.array! @clases do |clase|
  json.(clase, :id, :cancelada, :comment, :fecha, :horario, :max_users)
  json.old clase.old?
  json.completa clase.completa?
  json.cancelable clase.cancelable?
  json.dia clase.dia
  json.users clase.asistencias.sort_by{|y| y[:user_id]}, partial: 'api/asistencias/asistencia', as: :asistencia
  json.instructor clase.instructor.nombre_completo
  json.reemplazo clase.reemplazo.nombre_completo if clase.reemplazo.present?
end


