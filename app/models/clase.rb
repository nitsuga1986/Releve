class Clase < ActiveRecord::Base
	has_many :asistencias
	has_many :users, through: :asistencias
	#belongs_to :instructor, class_name: "User", foreign_key: "user_id"
	before_destroy :destroy_asistencias
	
	def add_asistencia (practicante_id)
		if self.users.where(:id => user_id).count == 0 then
			asist = self.asistencias.new
			asist.clase = self
			asist.user = User.find(user_id)
			asist.save
		end
	end
	
	private
	def destroy_asistencias
		asistencias.each{|x| x.destroy}		
    end
	
end
