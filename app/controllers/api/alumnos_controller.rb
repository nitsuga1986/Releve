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
  
  def search
	@alumno = User.find_by_email(params[:find_by_email])
	if !@alumno.nil? then
		render json:  @alumno
	else
		head :no_content
	end
  end
  
  def create
	if !@alumno = User.find_by_email(params[:email]) then
		@alumno = User.new(params.permit(:email, :horadnirio, :nombre, :apellido, :profesion, :fechanac, :fechaini, :telefono, :domicilio, :localidad, :nombre_contacto, :apellido_contacto, :telefono_contacto, :confirmed, :primera_clase, :nro_clases, :admin))
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
	if @alumno.update_attributes(params.permit(:email, :horadnirio, :nombre, :apellido, :profesion, :fechanac, :fechaini, :telefono, :domicilio, :localidad, :nombre_contacto, :apellido_contacto, :telefono_contacto, :confirmed, :primera_clase, :nro_clases, :admin)) then
		if !params[:users].nil? then
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
