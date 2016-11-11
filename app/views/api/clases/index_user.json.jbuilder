json.array! @clases do |clase|
  json.(clase, :id, :actividad_id, :cancelada, :comment, :duracion, :fecha, :horario, :max_users, :trialable)
  json.actividad clase.actividad.nombre
  json.completa clase.completa?
  json.old clase.old?
  json.cancelable clase.cancelable?
  json.dia clase.dia
  json.users clase.users, partial: 'api/users/user', as: :user
  json.instructor clase.instructor if clase.instructor.present?
  json.reemplazo clase.reemplazo if clase.reemplazo.present?
end


