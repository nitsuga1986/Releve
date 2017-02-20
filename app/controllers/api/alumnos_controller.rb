class Api::AlumnosController < ApplicationController
  before_action :authenticate_user!
  # Admin
  before_action only: [:create, :destroy, :newsletter] do head :unauthorized unless current_user && current_user.admin?   end
  # Admin & Instructor
  before_action only: [:index, :show, :update, :search, :autocomplete, :usr_clases,:usr_pagos] do head :unauthorized unless current_user && (current_user.instructor?||current_user.admin?)   end
  # Api render
  respond_to :json
  # ETAG -fresh_when()- is a key we use to determine whether a page has changed.
  etag { current_user.id }

  # Admin
  def create
	if !@alumno = User.find_by(email: params[:email]) then
		@alumno = User.new(alumno_params_admin)
		if @alumno.save then
			if !params[:packs].nil? then
				params[:packs].each do |pack|
					pac = @alumno.packs.new
					pac.actividad = Actividad.find(pack[:actividad_id])
					pac.cantidad = pack[:cantidad] if !pack[:cantidad].nil?
					pac.noperiod = pack[:noperiod] if !pack[:noperiod].nil?
					pac.fecha_start = pack[:fecha_start] if !pack[:fecha_start].nil?
					pac.fecha_end = pack[:fecha_end] if !pack[:fecha_end].nil?
					pac.save
				end
			end
			render 'api/alumnos/show', status: :created
		else
			render json: @alumno.errors, status: :internal_server_error
		end
	else
		render 'api/alumnos/show', status: :conflict
	end
  end

  def destroy
	User.destroy(params[:id])
	head :ok
  end

  def newsletter
	send_newsletter_email(params[:recipient], params[:mail_subject], params[:mail_title], params[:mail_pretext], params[:mail_body], params[:mail_button_text], params[:mail_button_link], params[:mail_subtitle], params[:mail_subbody], params[:include_reminder])
	head :ok
  end
  
  # Instructor
  def index
	@alumnos = User.all
	fresh_when(@alumnos)
  end

  def show
	@alumno = User.find(params[:id])
	#fresh_when(@alumno)
  end

  def update
	@alumno = User.find(params[:id])
	@alumno.actividades.each{|x| x.remove_user_from_actividad(@alumno)}
	if @alumno.update_attributes(alumno_params_admin) then
		if !params[:packs].nil? then
			params[:packs].each do |pack|
				pac = @alumno.packs.new
				pac.actividad = Actividad.find(pack[:actividad_id])
				pac.cantidad = !pack[:cantidad].nil? ? pack[:cantidad] : 1
				pac.cantidad01 = !pack[:cantidad_array][0].nil? ? pack[:cantidad_array][0] : 1
				pac.cantidad02 = !pack[:cantidad_array][1].nil? ? pack[:cantidad_array][1] : 1
				pac.cantidad03 = !pack[:cantidad_array][2].nil? ? pack[:cantidad_array][2] : 1
				pac.cantidad04 = !pack[:cantidad_array][3].nil? ? pack[:cantidad_array][3] : 1
				pac.cantidad05 = !pack[:cantidad_array][4].nil? ? pack[:cantidad_array][4] : 1
				pac.cantidad06 = !pack[:cantidad_array][5].nil? ? pack[:cantidad_array][5] : 1
				pac.cantidad07 = !pack[:cantidad_array][6].nil? ? pack[:cantidad_array][6] : 1
				pac.cantidad08 = !pack[:cantidad_array][7].nil? ? pack[:cantidad_array][7] : 1
				pac.cantidad09 = !pack[:cantidad_array][8].nil? ? pack[:cantidad_array][8] : 1
				pac.cantidad10 = !pack[:cantidad_array][9].nil? ? pack[:cantidad_array][9] : 1
				pac.cantidad11 = !pack[:cantidad_array][10].nil? ? pack[:cantidad_array][10] : 1
				pac.cantidad12 = !pack[:cantidad_array][11].nil? ? pack[:cantidad_array][11] : 1
				pac.noperiod = pack[:noperiod] if !pack[:noperiod].nil?
				pac.fecha_start = pack[:fecha_start] if !pack[:fecha_start].nil?
				pac.fecha_end = pack[:fecha_end] if !pack[:fecha_end].nil?
				pac.save
			end
		end
		head :ok
	else
		render json: @alumno.errors, status: :internal_server_error
	end
  end
  
  def search
	@alumno = User.find_by(email: params[:email])
	@alumno.present? ? (render 'api/alumnos/show') : (head :ok)
  end
  
  def autocomplete
	like = "%".concat(params[:term].concat("%"))
	@users = User.search_containing(like)
	list = @users.map {|u| Hash[ label:u.label, id: u.id, email: u.email]}
	render json: list, status: :ok
  end
  
  # User
  def current
	@user = current_user
	fresh_when(@user)
  end
  
  def instructores
	@users = User.where(instructor:true).order(:id)
	fresh_when(@users)
  end
  
  def update_current
	@alumno = current_user
	if @alumno.update_attributes(alumno_params) then
		head :ok
	else
		render json: @alumno.errors, status: :internal_server_error
	end
  end
  
  private
  
  def alumno_params
	 params.require(:alumno).permit(:email, :dni, :nombre, :apellido, :profesion, :fechanac, :telefono, :domicilio, :localidad, :nombre_contacto, :apellido_contacto, :telefono_contacto, :sexo, :reminders, :newsletter)
  end
  
  def alumno_params_admin
	 params.require(:alumno).permit(:email, :dni, :nombre, :apellido, :profesion, :fechanac, :telefono, :domicilio, :localidad, :nombre_contacto, :apellido_contacto, :telefono_contacto, :sexo, :reminders, :newsletter, :fechaini, :confirmed, :primera_clase, :nro_clases, :admin, :instructor, :accept_terms)
  end
  
  def send_newsletter_email(recipient, mail_subject, mail_title, mail_pretext, mail_body, mail_button_text, mail_button_link, mail_subtitle, mail_subbody, include_reminder)	
	case recipient
		when "all" then recipients = User.all.pluck(:email)
		when "reminders" then recipients = User.remaindable.pluck(:email)
		when "newsletter" then recipients = User.newsletterable.pluck(:email)
		when "test" then recipients = ""
		else recipients = recipient
	end
	logger.info "Newsletter mail sent with BCC: --------------------------------------------"
	logger.info recipients
	logger.info "--------------------------------------------"
	if recipients.kind_of?(Array) && recipients.count > 99
		logger.info "** chunked Recipients"
		chunkedArray = recipients.each_slice(99).to_a
		chunkedArray.each do |chunkedRecipients|
			UserMailer.newsletter_email(recipients, mail_subject, mail_title, mail_pretext, mail_body, mail_button_text, mail_button_link, mail_subtitle, mail_subbody, include_reminder).deliver
		end
	else
		UserMailer.newsletter_email(recipients, mail_subject, mail_title, mail_pretext, mail_body, mail_button_text, mail_button_link, mail_subtitle, mail_subbody, include_reminder).deliver
	end
  end			
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
end
