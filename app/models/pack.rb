class Pack < ActiveRecord::Base
	belongs_to :user, class_name: "User", foreign_key: "user_id"
	belongs_to :actividad, class_name: "Actividad", foreign_key: "actividad_id"
	
end
