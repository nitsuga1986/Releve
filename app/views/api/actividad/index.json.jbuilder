json.array! @actividades do |actividad|
  json.(actividad, :id, :nombre)
end


