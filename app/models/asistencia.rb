class Asistencia < ActiveRecord::Base
	belongs_to :user, class_name: "User", foreign_key: "user_id"
	belongs_to :clase, class_name: "Clase", foreign_key: "clase_id"
end
