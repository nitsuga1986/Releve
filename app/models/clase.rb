class Clase < ActiveRecord::Base
	has_many :asistencias
	has_many :users, through: :asistencias
	has_many :wait_lists
	has_many :wait_users, through: :wait_lists, source: :user
	belongs_to :actividad
	belongs_to :instructor, class_name: "User", foreign_key: "instructor"
	belongs_to :reemplazo, class_name: "User", foreign_key: "reemplazo"
	before_destroy :destroy_asistencias
	
	def as_json(options = { })
		h = super(options)
		h[:users] = self.users
		h[:actividad] = self.actividad.nombre
		h[:start] = DateTime.strptime(self.fecha.strftime('%Y-%m-%d')+" "+self.horario, '%Y-%m-%d %H:%M').strftime('%Q')
		h[:end] = (DateTime.strptime(self.fecha.strftime('%Y-%m-%d')+" "+self.horario, '%Y-%m-%d %H:%M')+ 1.hours).strftime('%Q')
		h[:title] = self.actividad.nombre+" ("+self.instructor.nombre_completo+")"
		if !self.instructor.nil? then
			h[:instructor] = self.instructor
		end
		if !self.reemplazo.nil? then
			h[:reemplazo] = self.reemplazo
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
	
	def add_wait_list (user_id)
		if self.wait_users.where(:id => user_id).count == 0 then
			wait = self.wait_lists.new
			wait.clase = self
			wait.user = User.find(user_id)
			wait.save
		end
	end
	
	def completa?
		return self.users.count >= self.max_users
	end
	private
	def destroy_asistencias
		asistencias.each{|x| x.destroy}		
    end
	
end
