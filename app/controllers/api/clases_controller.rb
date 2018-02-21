class Api::ClasesController < ApplicationController
  before_action :authenticate_user!
  # Admin
  before_action only: [:test_emails, :create, :bulk, :destroy] do redirect_to :new_user_session_path unless current_user && current_user.admin?   end
  # Admin & Instructor
  before_action only: [:index, :show, :search, :instructor, :update, :edit_bulk, :join_usr_multiple, :unjoin_usr_multiple, :edit_asistencias, :confirm, :unconfirm] do redirect_to :new_user_session_path unless current_user && (current_user.instructor?||current_user.admin?) end
  # Api render
  respond_to :json
  # ETAG -fresh_when()- is a key we use to determine whether a page has changed.
  etag { current_user.id }

  # Admin
  def create
	if !@clase = Clase.find_by(fecha: params[:fecha], horario: params[:horario], actividad: params[:actividad_id]) then
		@clase = Clase.new(clase_params)
		@clase.actividad = Actividad.find(params[:actividad_id])
		@clase.instructor = User.find(params[:instructor_id])
		@clase.reemplazo = User.find(params[:reemplazo_id]) if !params[:reemplazo_id].nil?
		if @clase.save then
			if !params[:users].nil? then
				params[:users].each do |user|
					@clase.add_asistencia(user[:id]) if user[:id]	
				end
			end
			head :created
		else
			render json: @clase.errors, status: :internal_server_error
		end
	else
		head :conflict
	end
  end
  
  def bulk
	if params[:fecha_start].present? && params[:fecha_end].present? && params[:max_users].present? && params[:instructor_id].present? && params[:actividad_id].present? && params[:filterDay].present? then
		Date.parse(params[:fecha_start]).upto(Date.parse(params[:fecha_end])) do |date|
			if (params[:filterDay][0..11].any? && date.wday==1)||(params[:filterDay][12..23].any? && date.wday==2)||(params[:filterDay][24..35].any? && date.wday==3)||(params[:filterDay][36..47].any? && date.wday==4)||(params[:filterDay][48..59].any? && date.wday==5) then
				case date.wday
					when 1 then horarioArray = params[:filterDay][0..11]	# Lunes
					when 2 then horarioArray = params[:filterDay][12..23]	# Martes
					when 3 then horarioArray = params[:filterDay][24..35]	# Miércoles
					when 4 then horarioArray = params[:filterDay][36..47]	# Jueves
					when 5 then horarioArray = params[:filterDay][48..59]	# Viernes
				end
				horarioArray.each_with_index do |horarioBool, index|
					if horarioBool then
						params[:horario] = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"][index]
						params[:fecha] = date.strftime("%Y-%m-%d")
						if !@clase = Clase.find_by(fecha: params[:fecha], horario: params[:horario]) then
							@clase = Clase.new(clase_params)
							@clase.actividad = Actividad.find(params[:actividad_id])
							@clase.instructor = User.find(params[:instructor_id])
							@clase.save
						end
					end				
				end
			end
		end
		head :created
	else
		head :bad_request
	end
  end

  def destroy
	Clase.destroy(params[:id])
	head :ok
  end
  
  # Instructor
  def index
	@clases = Clase.order(:fecha,:horario)
	fresh_when(@clases)
  end

  def index_user
	if params.has_key?(:recent) && params[:recent]=='true' then
		logger.info('true*********************************************************')
		logger.info(params[:recent])
		@clases = User.find(params[:id]).clases.recent.order(:fecha,:horario)
	else
		logger.info('false*********************************************************')
		logger.info(params[:recent])
		@clases = User.find(params[:id]).clases.order(:fecha,:horario)
	end
	#fresh_when(@clases) asistencias?
  end

  def show
	@clase = Clase.find(params[:id])
	#fresh_when(@clase)
  end
  
  def search
	@clase = Clase.find_by(fecha: params[:fecha], horario: params[:horario], instructor: params[:instructor])
	if !@clase.nil? then
		fresh_when(@clase)
		render 'api/clases/show'
	else
		head :ok
	end
  end
  
  def index_instructor
	if params[:instructor_id] == 9999999 then
		@clases = Clase.btw_dates(params[:fecha_start],params[:fecha_end])
		fresh_when(@clases)
	else
		@clases = Clase.by_instructor(params[:instructor_id]).btw_dates(params[:fecha_start],params[:fecha_end])
		fresh_when(@clases)
	end
	if @clases.nil? then
		head :ok
	end
  end

  def update
	@clase = Clase.find(params[:id])
	if params[:users].nil? then
		@clase.users.each{|x| x.remove_from_clase(@clase)}
	else
		@clase.users.each{|x| x.remove_from_clase(@clase) if !params[:users].map{|y| y[:id]}.include? x.id }
	end
	@clase.actividad = Actividad.find(params[:actividad_id])
	@clase.instructor = User.find(params[:instructor_id])
	@clase.reemplazo = (!params[:reemplazo_id].nil? ? User.find(params[:reemplazo_id]) : nil)
	if @clase.update_attributes(clase_params) then
		if !params[:users].nil? then
			params[:users].each do |user|
				@clase.add_asistencia(user[:id]) if user[:id]	
			end
		end
		head :ok
	else
		render json: @clase.errors, status: :internal_server_error
	end
  end
  
  def edit_bulk
	if params[:fecha_start].present? && params[:fecha_end].present? && params[:max_users].present? && params[:instructor_id].present? && params[:actividad_id].present? && params[:filterDay].present? then
		Date.parse(params[:fecha_start]).upto(Date.parse(params[:fecha_end])) do |date|
			if (params[:filterDay][0..11].any? && date.wday==1)||(params[:filterDay][12..23].any? && date.wday==2)||(params[:filterDay][24..35].any? && date.wday==3)||(params[:filterDay][36..47].any? && date.wday==4)||(params[:filterDay][48..59].any? && date.wday==5) then
				case date.wday
					when 1 then horarioArray = params[:filterDay][0..11]	# Lunes
					when 2 then horarioArray = params[:filterDay][12..23]	# Martes
					when 3 then horarioArray = params[:filterDay][24..35]	# Miércoles
					when 4 then horarioArray = params[:filterDay][36..47]	# Jueves
					when 5 then horarioArray = params[:filterDay][48..59]	# Viernes
				end
				horarioArray.each_with_index do |horarioBool, index|
					if horarioBool then
						params[:horario] = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"][index]
						params[:fecha] = date.strftime("%Y-%m-%d")
						if @clase = Clase.find_by(fecha: params[:fecha], horario: params[:horario]) then
							@clase.comment = (!params[:comment].nil? ? params[:comment] : '')
							@clase.cancelada = (!params[:cancelada].nil? ? params[:cancelada] : false)
							@clase.trialable = (!params[:trialable].nil? ? params[:trialable] : false)
							@clase.instructor = (!params[:instructor_id].nil? ? User.find(params[:instructor_id]) : nil)
							@clase.reemplazo = (!params[:reemplazo_id].nil? ? User.find(params[:reemplazo_id]) : nil)
							@clase.update_attributes(clase_params)
							@clase.save
						end
					end				
				end
			end
		end
		head :created
	else
		head :bad_request
	end
  end

  def join_usr_multiple
	selected_user = User.find(params[:_json][0]["alumno_id"])
	@clases= []
	agendadasarray = []
	clasesagendadas = ""
	params[:_json].each_with_index do |clase, index|
		@clase = Clase.find(clase[:id])
		@clase.add_asistencia(selected_user.id)
		@clases.push(@clase)
		clasesagendadas = clasesagendadas+" "+@clase.actividad.nombre+" <strong>"+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+" "+@clase.horario+"hs</strong>"
		clasesagendadas = clasesagendadas+", " if clase!=params[:_json].last 
		if((index + 1) % 4 == 0)|| clase==params[:_json].last 
			agendadasarray.push(clasesagendadas)
			clasesagendadas = ""
		end
	end
	agendadasarray.reverse.each { |x| register_event('continuation', x) }
	register_event('joinmultiple', current_user.nombre_completo+" agendó a <strong>"+selected_user.nombre_completo+"</strong> en las siguientes clases: ")
	send_join_multiple_email(selected_user,@clases)
	head :ok
  end
  
  def unjoin_usr_multiple
	selected_user = User.find(params[:_json][0]["alumno_id"])
	@clases= []
	canceladasarray = []
	clasescanceladas = ""
	if (params[:_json].all? {|clase| Clase.find(clase[:id]).cancelable? }) or current_user.instructor? or current_user.admin? then
		params[:_json].each_with_index do |clase, index|
			@clase = Clase.find(clase[:id])
			if @clase.completa? and !@clase.wait_lists.empty? then
				send_waitlist_email(@clase)
				@clase.destroy_wait_lists
				register_event('waitlistclear', "Se hizo un lugar en la clase del "+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+" y se avisó a las personas en lista de espera")
			end
			selected_user.remove_from_clase(@clase)
			@clases.push(@clase)
			clasescanceladas = clasescanceladas+" "+@clase.actividad.nombre+" <strong>"+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+" "+@clase.horario+"hs</strong>"
			clasescanceladas = clasescanceladas+", " if clase!=params[:_json].last 
			if((index + 1) % 4 == 0)|| clase==params[:_json].last 
				canceladasarray.push(clasescanceladas)
				clasescanceladas = ""
			end
		end
		canceladasarray.reverse.each { |x| register_event('unjoin_continuation', x) }
		register_event('unjoinmultiple', current_user.nombre_completo+" canceló a <strong>"+selected_user.nombre_completo+"</strong> de las siguientes clases: ")
		send_unoin_multiple_email(selected_user,@clases)
		head :ok
	else
		head :bad_request
	end
  end

  def edit_asistencias
	params[:_json].each do |asistencia|
		Asistencia.find(asistencia['asistencia_id']).update_attribute(:confirmed,asistencia['confirmed'])
	end
	head :ok
  end
  
  def confirm
	Asistencia.find(params[:id]).update_attribute(:confirmed, true)
	head :ok
  end
  def unconfirm
	Asistencia.find(params[:id]).update_attribute(:confirmed, false)
	head :ok
  end
  
  # User
  def index_current
	@clases = Clase.after_date(DateTime.now.beginning_of_month).order(:fecha,:horario)
	#asistencias = current_user.asistencias
	# fresh_when([@clases, asistencias])
  end
  
  def history_usr
	@asistencias = current_user.asistencias
	fresh_when(@asistencias)
  end

  def join 
	@clase = Clase.find(params[:id])
	if can_join?(current_user, @clase) then
		@clase.add_asistencia(current_user.id)
		send_join_email(current_user,@clase)
		register_event('join',"<strong>"+current_user.nombre_completo+"</strong> se agendó a la clase de "+@clase.actividad.nombre+" del <strong>"+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+" "+@clase.horario+"hs</strong>")
		head :ok
	else
		head :bad_request
	end
  end
  
  def join_multiple
	@clases= []
	agendadasarray = []
	clasesagendadas = ""
	params[:_json].each_with_index do |clase, index|
		@clase = Clase.find(clase[:id])
		if can_join?(current_user, @clase) then
			@clase.add_asistencia(current_user.id)
			@clases.push(@clase)
			clasesagendadas = clasesagendadas+" "+@clase.actividad.nombre+" <strong>"+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+" "+@clase.horario+"hs</strong>"
			clasesagendadas = clasesagendadas+", " if clase!=params[:_json].last 
			if((index + 1) % 4 == 0)|| clase==params[:_json].last 
				agendadasarray.push(clasesagendadas)
				clasesagendadas = ""
			end
		end
	end
	agendadasarray.reverse.each { |x| register_event('continuation', x) }
	register_event('joinmultiple', "<strong>"+current_user.nombre_completo+"</strong> se agendó en las siguientes clases: ")
	send_join_multiple_email(current_user,@clases)
	head :ok
  end

  def unjoin 
	@clase = Clase.find(params[:id])
	if @clase.cancelable? or current_user.instructor? or current_user.admin? then
		if @clase.completa? and !@clase.wait_lists.empty? then
			send_waitlist_email(@clase)
			@clase.destroy_wait_lists
			register_event('waitlistclear', "Se hizo un lugar en la clase del "+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+" y se avisó a las personas en lista de espera")
		end
		current_user.remove_from_clase(@clase)
		send_unjoin_email(current_user,@clase)
		send_unjoin_comment_email(current_user,@clase,params[:comentario]) if params.has_key?(:comentario)
		register_event('unjoin', "<strong>"+current_user.nombre_completo+"</strong> canceló su clase de "+@clase.actividad.nombre+" del <strong>"+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+" "+@clase.horario+"hs</strong>")
		head :ok
	else
		head :bad_request
	end
  end
  
  def waitlist 
	@clase = Clase.find(params[:id])
	@clase.add_wait_list(current_user.id)
	register_event('waitlist', "<strong>"+current_user.nombre_completo+"</strong> se agregó a la lista de espera de la clase del <strong>"+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+"</strong>")
	head :ok
  end

  private
  
  # Emails
  def send_join_multiple_email(user,clases)					UserMailer.join_multiple_email(user,clases).deliver end
  def send_unoin_multiple_email(user,clases)				UserMailer.unjoin_multiple_email(user,clases).deliver end
  def send_join_email(user,clase)							UserMailer.join_email(user,clase).deliver end
  def send_waitlist_email(clase)							UserMailer.waitlist_email(clase).deliver end
  def send_unjoin_email(user,clase)							UserMailer.unjoin_email(current_user,@clase).deliver end
  def send_unjoin_comment_email(user, clase, comentario)	UserMailer.unjoin_comment_email(user, clase, comentario).deliver end

  # Other
  def clase_params
	 params.permit(:fecha, :horario, :max_users, :duracion, :trialable, :cancelada, :comment)
  end

  def register_event(name,content)
	Event.create(name: name,content: content)
  end
  
  def can_join?(alumno, clase)
	return (!clase.completa? and !clase.old?)
  end
  
end
