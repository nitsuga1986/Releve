class Api::ClasesController < ApplicationController
  before_action :authenticate_user!
  before_action only: [:test_emails, :create, :bulk, :destroy] do redirect_to :new_user_session_path unless current_user && current_user.admin?   end
  before_action only: [:index, :show, :search, :instructor, :update, :edit_bulk, :join_usr_multiple, :confirm, :unconfirm] do redirect_to :new_user_session_path unless current_user && (current_user.instructor?||current_user.admin?) end

  respond_to :json

  
  # ADMIN
  ###########################
  # routes.rb, resources.js, clases_controller.rb, templates/clase/index.html, javascripts/controllers/ClaseIndexCtrl.js
  def test_emails
	UserMailer.welcome_email(current_user).deliver
	UserMailer.join_email(current_user,Clase.last).deliver
	UserMailer.join_multiple_email(current_user,Clase.first(4)).deliver
	UserMailer.unjoin_email(current_user,Clase.last).deliver
	UserMailer.pricing_email(current_user.email,"Nombre","Apellido").deliver
	UserMailer.remainder_email(current_user).deliver
	render json:  current_user
  end

  def create
	if !@clase = Clase.find_by_fecha_and_horario(params[:fecha],params[:horario]) then
		@clase = Clase.new(params.permit(:fecha, :horario, :max_users, :duracion, :trialable, :cancelada, :comment))
		@clase.actividad = Actividad.find(params[:actividad_id])
		@clase.instructor = User.find(params[:instructor_id])
		@clase.reemplazo = User.find(params[:reemplazo_id]) if !params[:reemplazo_id].nil?
		if @clase.save then
			if !params[:users].nil? then
				params[:users].each do |user|
					@clase.add_asistencia(user[:id]) if user[:id]	
				end
			end
			render json: @clase, status: :created
		else
			render json: @clase.errors, status: :unprocessable_entity
		end
	else
		render json: @clase, status: :conflict
	end
  end
  
  def bulk
	if params[:fecha_start].present? && params[:fecha_end].present? && params[:horario].present? && params[:max_users].present? && params[:instructor_id].present? && params[:actividad_id].present? then
		Date.parse(params[:fecha_start]).upto(Date.parse(params[:fecha_end])) do |date|
			if (params[:bool_monday]==true && date.wday==1)||(params[:bool_tuesday]==true && date.wday==2)||(params[:bool_wednesday]==true && date.wday==3)||(params[:bool_thursday]==true && date.wday==4)||(params[:bool_friday]==true && date.wday==5)||(params[:bool_saturday]==true && date.wday==6)||(params[:bool_sunday]==true && date.wday==0) then
				if !@clase = Clase.find_by_fecha_and_horario(date.strftime("%Y-%m-%d"),params[:horario]) then
					params[:fecha] = date.strftime("%Y-%m-%d")
					@clase = Clase.new(params.permit(:fecha, :horario, :max_users, :duracion, :trialable))
					@clase.actividad = Actividad.find(params[:actividad_id])
					@clase.instructor = User.find(params[:instructor_id])
					if @clase.save then
						if !params[:users].nil? then
							params[:users].each do |user|
								@clase.add_asistencia(user[:id]) if user[:id]	
							end
						end
					end
				end
			end
		end
		render json: @clase, status: :created
	else
		render json: {
			error: "Missing data",
			status: :unprocessable_entity
		}
	end
  end

  def destroy
	@clase = Clase.find(params[:id])    
	@clase.destroy
	head :no_content
  end
  
  # INSTRUCTOR
  ###########################
  def index
	@clases = Clase.all.order(:fecha,:horario)
  end

  def show
	@clase = Clase.find(params[:id])
	render json:  @clase
  end
  
  def search
	@clase = Clase.find_by_fecha_and_horario_and_instructor(params[:fecha],params[:horario],params[:instructor])
	if !@clase.nil? then
		render json:  @clase
	else
		head :no_content
	end
  end
  
  def instructor
	if params[:instructor_id] == 9999999 then
		@clases = Clase.where('fecha >= ? AND fecha <= ?',params[:fecha_start],params[:fecha_end])
	else
		@clases = User.find(params[:instructor_id]).instructorados.where('fecha >= ? AND fecha <= ?',params[:fecha_start],params[:fecha_end])
	end
	if @clases.nil? then
		head :no_content
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
	if @clase.update_attributes(params.permit(:fecha, :horario, :max_users, :duracion, :trialable, :cancelada, :comment)) then
		if !params[:users].nil? then
			params[:users].each do |user|
				@clase.add_asistencia(user[:id]) if user[:id]	
			end
		end
		head :no_content
	else
		render json: @clase.errors, status: :unprocessable_entity
	end
  end
  
  def edit_bulk
  
	if params[:fecha_start].present? && params[:fecha_end].present? && params[:horario].present? && params[:actividad_id].present? then
		Date.parse(params[:fecha_start]).upto(Date.parse(params[:fecha_end])) do |date|
			if (params[:bool_monday]==true && date.wday==1)||(params[:bool_tuesday]==true && date.wday==2)||(params[:bool_wednesday]==true && date.wday==3)||(params[:bool_thursday]==true && date.wday==4)||(params[:bool_friday]==true && date.wday==5)||(params[:bool_saturday]==true && date.wday==6)||(params[:bool_sunday]==true && date.wday==0) then
				if @clase = Clase.find_by_fecha_and_horario_and_actividad_id(date.strftime("%Y-%m-%d"),params[:horario],params[:actividad_id]) then
					@clase.comment = (!params[:comment].nil? ? params[:comment] : '')
					@clase.cancelada = (!params[:cancelada].nil? ? params[:cancelada] : false)
					@clase.trialable = (!params[:trialable].nil? ? params[:trialable] : false)
					@clase.instructor = (!params[:instructor_id].nil? ? User.find(params[:instructor_id]) : nil)
					@clase.reemplazo = (!params[:reemplazo_id].nil? ? User.find(params[:reemplazo_id]) : nil)
					@clase.update_attributes(params.permit(:max_users, :duracion))
					@clase.save
				end
			end
		end
		render json: @clase, status: :created
	else
		render json: {
			error: "Missing data",
			status: :unprocessable_entity
		}
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
	agendadasarray.reverse.each { |x| Event.create(name:'continuation',content: x) }
	Event.create(name:'joinmultiple',content: current_user.nombre_completo+" agendó a <strong>"+selected_user.nombre_completo+"</strong> en las siguientes clases: ")
	UserMailer.join_multiple_email(selected_user,@clases).deliver
	render json: @clase, status: :created
  end

  def confirm 
	@clase = Clase.find(params[:id])
	Asistencia.find(params[:asistencia_id]).update_attribute(:confirmed,true)
	head :no_content
  end

  def unconfirm 
	@clase = Clase.find(params[:id])
	Asistencia.find(params[:asistencia_id]).update_attribute(:confirmed,false)
	head :no_content
  end
  
  # USER
  ###########################
  def index_usr
	@clases = Clase.where('fecha >= ?', DateTime.now.beginning_of_month).order(:fecha,:horario)
  end
  
  def history_usr
	@clases = current_user.clases
  end

  def join 
	@clase = Clase.find(params[:id])
	@clase.add_asistencia(current_user.id)
	UserMailer.join_email(current_user,@clase).deliver
	Event.create(name:'join',content: "<strong>"+current_user.nombre_completo+"</strong> se agendó a la clase de "+@clase.actividad.nombre+" del <strong>"+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+" "+@clase.horario+"hs</strong>")
	render json: @clase, status: :created
  end
  
  def join_multiple
	@clases= []
	agendadasarray = []
	clasesagendadas = ""
	params[:_json].each_with_index do |clase, index|
		@clase = Clase.find(clase[:id])
		@clase.add_asistencia(current_user.id)
		@clases.push(@clase)
		clasesagendadas = clasesagendadas+" "+@clase.actividad.nombre+" <strong>"+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+" "+@clase.horario+"hs</strong>"
		clasesagendadas = clasesagendadas+", " if clase!=params[:_json].last 
		if((index + 1) % 4 == 0)|| clase==params[:_json].last 
			agendadasarray.push(clasesagendadas)
			clasesagendadas = ""
		end
	end
	agendadasarray.reverse.each { |x| Event.create(name:'continuation',content: x) }
	Event.create(name:'joinmultiple',content: "<strong>"+current_user.nombre_completo+"</strong> se agendó en las siguientes clases: ")
	UserMailer.join_multiple_email(current_user,@clases).deliver
	render json: @clase, status: :created
  end

  def unjoin 
	@clase = Clase.find(params[:id])
	if @clase.completa? then
		UserMailer.waitlist_email(@clase).deliver 
		@clase.destroy_wait_lists
		Event.create(name:'waitlistclear',content: "Se hizo un lugar en la clase del "+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+" y se avisó a las personas en lista de espera")
	end
	current_user.remove_from_clase(@clase)
	UserMailer.unjoin_email(current_user,@clase).deliver
	UserMailer.unjoin_comment_email(current_user,@clase,params[:comentario]).deliver if params.has_key?(:comentario)
	Event.create(name:'unjoin',content: "<strong>"+current_user.nombre_completo+"</strong> canceló su clase de "+@clase.actividad.nombre+" del <strong>"+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+" "+@clase.horario+"hs</strong>")
	render json: @clase, status: :created
  end
  
  def waitlist 
	@clase = Clase.find(params[:id])
	@clase.add_wait_list(current_user.id)
	Event.create(name:'waitlist',content: "<strong>"+current_user.nombre_completo+"</strong> se agregó a la lista de espera de la clase del <strong>"+@clase.dia+" "+@clase.fecha.strftime('%d/%m')+"</strong>")
	render json: @clase, status: :created
  end
  
end
