json.array! @asistencias do |asistencia|
  json.(asistencia, :confirmed)
  json.old asistencia.clase.old?
  json.(asistencia.clase, :id, :cancelada, :comment, :fecha, :horario)
  json.actividad asistencia.clase.actividad.nombre
  json.old asistencia.clase.old?
  json.cancelable asistencia.clase.cancelable?
  json.dia asistencia.clase.dia
  json.users asistencia.clase.users, partial: 'api/users/user', as: :user
  json.instructor asistencia.clase.instructor.nombre_completo if asistencia.clase.instructor.present?
  json.reemplazo asistencia.clase.reemplazo.nombre_completo if asistencia.clase.reemplazo.present?
end


