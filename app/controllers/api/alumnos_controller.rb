class Api::AlumnosController < ApplicationController
  before_action :authenticate_user!
  # Admin
  before_action only: [:create, :destroy, :index, :show, :update, :search] do head :unauthorized unless current_user && current_user.admin?   end
  # Admin & Instructor
  before_action only: [:autocomplete, :usr_clases,:usr_pagos] do head :unauthorized unless current_user && (current_user.instructor?||current_user.admin?)   end
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
  
  def index
	@alumnos = User.all
	fresh_when(@alumnos)
  end

  def show
	@alumno = User.find(params[:id])
	fresh_when(@alumno)
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
  
  # Instructor
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
  
end
