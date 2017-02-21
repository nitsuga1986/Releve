json.array! @clases do |clase|
  json.(clase, :id, :actividad_id, :cancelada, :comment, :duracion, :fecha, :horario, :max_users, :trialable)
  json.actividad clase.actividad.nombre
  json.completa clase.completa?
  json.old clase.old?
  json.cancelable clase.cancelable?
  json.dia clase.dia
  json.users clase.asistencias.sort_by{|y| y[:user_id]}, partial: 'api/asistencias/asistencia', as: :asistencia
  json.instructor clase.instructor.nombre_completo if clase.instructor.present?
  json.reemplazo clase.reemplazo.nombre_completo if clase.reemplazo.present?
end


