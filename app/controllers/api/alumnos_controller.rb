class Api::AlumnosController < ApplicationController
  before_action :authenticate_user!
  respond_to :json

  def index
	@alumno = User.all
	respond_with @alumno
  end

  def show
	if current_user.try(:admin?)
		@alumno = User.find(params[:id])
		respond_with @alumno
	else
		redirect_to root_path
	end
  end
  
  def autocomplete
	like= "%".concat(params[:term].concat("%"))
	@users = User.where("email like ?", like)
	list = @users.map {|u| Hash[ label:u.email, id: u.id, email: u.email]}
	render json: list
  end
  
  def create
	if !@alumno = User.find_by_email(params[:email]) then
		@alumno = User.new(params.permit(:email, :dni, :nombre, :apellido, :profesion, :fechanac, :fechaini, :telefono, :domicilio, :localidad, :nombre_contacto, :apellido_contacto, :telefono_contacto, :sexo, :confirmed, :primera_clase, :nro_clases, :admin))
		if @alumno.save then
			render json: @alumno, status: :created
		else
			render json: @alumno.errors, status: :unprocessable_entity
		end
	else
		render json: @alumno, status: :conflict
	end
  end

  def update
	@alumno = User.find(params[:id])
	@alumno.actividades.each{|x| x.remove_user_from_actividad(@alumno)}
	if @alumno.update_attributes(params.permit(:email, :dni, :nombre, :apellido, :profesion, :fechanac, :fechaini, :telefono, :domicilio, :localidad, :nombre_contacto, :apellido_contacto, :telefono_contacto, :sexo, :confirmed, :primera_clase, :nro_clases, :admin)) then
		if !params[:actividades].nil? then
			params[:actividades].each do |actividad|
				if !actividad[:cantidad].nil? then
					if actividad[:clase_de_prueba].nil? then actividad[:clase_de_prueba] = false end
					@alumno.add_actividad_to_alumno(actividad[:id],actividad[:cantidad],actividad[:clase_de_prueba]) if actividad[:id]	
				end
			end
		end
		head :no_content
	else
		render json: @alumno.errors, status: :unprocessable_entity
	end
  end

  def destroy
	@alumno = User.find(params[:id])    
	@alumno.destroy
	head :no_content
  end
  
end
