class Clase < ActiveRecord::Base
	scope :btw_dates, ->(start_date, end_date) { where('fecha >= ? AND fecha <= ?', start_date, end_date) if (start_date.present? &&  end_date.present?) }
	scope :after_date, ->(date) { where('fecha >= ?', date) if date.present? }
	scope :by_instructor, ->(user_id) { where('instructor=? OR reemplazo=?', user_id, user_id) if user_id.present? }

	scope :total_by_horario, ->(horario) { where('horario=?', horario).collect{|x| x.asistencias.count}.inject(0, :+)  if horario.present?}
	scope :total_by_horario_and_confirmed, ->(horario,confirmed) { where('horario=?', horario).collect{|x| x.asistencias.where('confirmed=?',confirmed).count}.inject(0, :+)  if horario.present?}
	
	has_many :asistencias
	has_many :users, through: :asistencias
	has_many :wait_lists
	has_many :wait_users, through: :wait_lists, source: :user
	
	belongs_to :actividad
	belongs_to :instructor, class_name: "User", foreign_key: "instructor"
	belongs_to :reemplazo, class_name: "User", foreign_key: "reemplazo"
	
	before_destroy :destroy_related

	def as_json(options = { })
		h = super(options)
		h[:users] = self.users
		h[:actividad] = self.actividad.nombre
		h[:wait_lists] = self.wait_lists
		h[:completa] = self.completa?
		h[:old] = self.old?
		h[:cancelable] = self.cancelable?
		h[:dia] = self.dia
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
	
	def destroy_wait_lists() wait_lists.each{|x| x.destroy}	end
	def completa?() self.users.count >= self.max_users end
	def old?() DateTime.strptime(self.fecha.strftime('%Y-%m-%d')+" "+self.horario+' -0300', '%Y-%m-%d %H:%M %Z') < DateTime.now end
	def cancelable?() DateTime.strptime(self.fecha.strftime('%Y-%m-%d')+" "+self.horario+' -0300', '%Y-%m-%d %H:%M %Z') - (6.0/24) > DateTime.now end
	def dia() I18n.t('date.day_names')[self.fecha.wday] end
	
	private
	def destroy_related
		asistencias.each{|x| x.destroy}
		wait_lists.each{|x| x.destroy}		
    end
	
end
