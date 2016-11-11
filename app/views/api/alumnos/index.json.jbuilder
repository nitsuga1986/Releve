json.array! @alumnos do |alumno|
  json.(alumno, :id, :nombre, :apellido, :email, :telefono, :sexo, :primera_clase, :confirmed, :admin)
end
