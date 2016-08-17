class Clase < ActiveRecord::Base
	has_many :asistencias
	has_many :users, through: :asistencias
	#belongs_to :instructor, class_name: "User", foreign_key: "user_id"
	before_destroy :destroy_asistencias
	
	def as_json(options = { })
		h = super(options)
		h[:users] = self.users
		h[:start] = DateTime.strptime(self.fecha.strftime('%Y-%m-%d')+" "+self.horario, '%Y-%m-%d %H:%M').strftime('%Q')
		h[:end] = (DateTime.strptime(self.fecha.strftime('%Y-%m-%d')+" "+self.horario, '%Y-%m-%d %H:%M')+ 1.hours).strftime('%Q')
		h[:title] = self.actividad+" ("+self.instructor+")"
		if self.actividad=="Pilates"
			h[:class] = "info"
		elsif self.actividad=="Estiramiento"
			h[:class] = "warning"
		elsif self.actividad=="Dance Pilates"
			h[:class] = "info"
		else
			h[:class] = "default"
		end
		h
	end
	
	def add_asistencia (user_id)
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
