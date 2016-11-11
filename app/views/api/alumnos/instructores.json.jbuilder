json.array! @users do |user|
  json.(user, :id, :nombre_completo)
end
