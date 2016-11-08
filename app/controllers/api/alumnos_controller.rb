class Api::AlumnosController < ApplicationController
  before_action :authenticate_user!
  # Admin
  before_action only: [:create, :destroy, :index, :show, :update, :search] do redirect_to :new_user_session_path unless current_user && current_user.admin?   end
  # Admin & Instructor
  before_action only: [:autocomplete, :usr_clases,:usr_pagos] do redirect_to :new_user_session_path unless current_user && (current_user.instructor?||current_user.admin?)   end
  # Api render
  respond_to :json

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
			render json: @alumno, status: :created
		else
			render json: @alumno.errors, status: :unprocessable_entity
		end
	else
		render json: @alumno, status: :conflict
	end
  end

  def destroy
	@alumno = User.find(params[:id])    
	@alumno.destroy
	head :no_content
  end
  
  def index
	@alumno = User.all
	respond_with @alumno
  end

  def show
	@alumno = User.find(params[:id])
	respond_with @alumno
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
		head :no_content
	else
		render json: @alumno.errors, status: :unprocessable_entity
	end
  end
  
  def search
	@alumno = User.find_by(email: params[:email])
	if !@alumno.nil? then
		render json:  @alumno
	else
		head :no_content
	end
  end
  
  # Instructor
  def autocomplete
	like= "%".concat(params[:term].concat("%"))
	@users = User.where("email like ? OR nombre like ? OR apellido like ?", like, like, like)
	list = @users.map {|u| Hash[ label:u.label, id: u.id, email: u.email]}
	render json: list
  end

  def usr_clases
	@clases = User.find(params[:id]).clases.order(:fecha,:horario)
	render json: @clases, status: :ok
  end

  def usr_pagos
	@pagos = User.find(params[:id]).pagos.order(:fecha)
	render json: @pagos, status: :ok
  end
  
  # User
  def current
	@user = current_user
  end
  
  def instructores
	@alumno = User.where(instructor:true).order(:id)
	render json: @alumno
  end
  
  def update_current
	@alumno = current_user
	if @alumno.update_attributes(alumno_params) then
		head :no_content
	else
		render json: @alumno.errors, status: :unprocessable_entity
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
