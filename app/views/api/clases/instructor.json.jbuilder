json.array! @clases do |clase|
  json.(clase, :id, :cancelada, :comment, :fecha, :horario, :max_users)
  json.old clase.old?
  json.completa clase.completa?
  json.dia clase.dia
  json.users clase.users, partial: 'api/users/user', as: :user
  json.reemplazo clase.reemplazo.nombre_completo if clase.reemplazo.present?
end


