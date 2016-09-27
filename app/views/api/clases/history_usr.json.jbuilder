json.array! @clases do |clase|
  json.(clase, :id, :cancelada, :comment, :fecha, :horario)
  json.actividad clase.actividad.nombre
  json.old clase.old?
  json.cancelable clase.cancelable?
  json.dia clase.dia
  json.users clase.users, partial: 'api/users/user', as: :user
  json.instructor clase.instructor.nombre_completo if clase.instructor.present?
  json.reemplazo clase.reemplazo.nombre_completo if clase.reemplazo.present?
end


