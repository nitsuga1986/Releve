class Api::AlumnosController < ApplicationController
  before_action :authenticate_user!
  before_action only: [:create, :destroy] do redirect_to :new_user_session_path unless current_user && current_user.admin?   end
  before_action only: [:index, :show, :autocomplete, :update] do redirect_to :new_user_session_path unless current_user && (current_user.instructor?||current_user.admin?)   end
  
  respond_to :json

  # ADMIN
  ###########################
  def create
	if !@alumno = User.find_by_email(params[:email]) then
		@alumno = User.new(params.permit(:email, :dni, :nombre, :apellido, :profesion, :fechanac, :fechaini, :telefono, :domicilio, :localidad, :nombre_contacto, :apellido_contacto, :telefono_contacto, :sexo, :confirmed, :primera_clase, :nro_clases, :admin, :instructor, :sexo, :reminders, :newsletter, :accept_terms))
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
  
  # INSTRUCTOR
  ###########################
  def index
	@alumno = User.all
	respond_with @alumno
  end

  def show
	@alumno = User.find(params[:id])
	respond_with @alumno
  end

  def autocomplete
	like= "%".concat(params[:term].concat("%"))
	@users = User.where("email like ? OR nombre like ? OR apellido like ?", like, like, like)
	list = @users.map {|u| Hash[ label:u.label, id: u.id, email: u.email]}
	render json: list
  end

  def update
	@alumno = User.find(params[:id])
	@alumno.actividades.each{|x| x.remove_user_from_actividad(@alumno)}
	if @alumno.update_attributes(params.permit(:email, :dni, :nombre, :apellido, :profesion, :fechanac, :fechaini, :telefono, :domicilio, :localidad, :nombre_contacto, :apellido_contacto, :telefono_contacto, :sexo, :confirmed, :primera_clase, :nro_clases, :admin, :instructor, :sexo, :reminders, :newsletter, :accept_terms)) then
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
  
  # USER
  ###########################
  def current
	@user = current_user
  end
  
  def instructores
	@alumno = User.where(instructor:true).order(:id)
	render json: @alumno
  end
  
  def update_current
	@alumno = current_user
	if @alumno.update_attributes(params.permit(:email, :dni, :nombre, :apellido, :profesion, :fechanac, :telefono, :domicilio, :localidad, :nombre_contacto, :apellido_contacto, :telefono_contacto, :sexo, :reminders, :newsletter)) then
		head :no_content
	else
		render json: @alumno.errors, status: :unprocessable_entity
	end
  end
  
end
