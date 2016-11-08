class Api::ActividadController < ApplicationController
  before_action :authenticate_user!
  # Admin
  before_action only: [:create, :destroy] do redirect_to :new_user_session_path unless current_user && current_user.admin?   end
  # Admin & Instructor
  before_action only: [:update] do redirect_to :new_user_session_path unless current_user && (current_user.instructor?||current_user.admin?)   end
  # Api render
  respond_to :json

  # Admin
  def create
	if !@actividad = Actividad.find_by(nombre: params[:nombre]) then
		@actividad = Actividad.new(actividad_params)
		if @actividad.save then
			render json: @actividad, status: :created #, location: @actividad
		else
			render json: @actividad.errors, status: :unprocessable_entity
		end
	else
		render json: @actividad, status: :conflict
	end
  end
  
  def destroy
	@actividad = Actividad.find(params[:id])    
	@actividad.destroy
	head :no_content
  end
  
  # Instructor
  def update
	@actividad = Actividad.find(params[:id])
	if @actividad.update_attributes(actividad_params) then
		head :no_content
	else
		render json: @actividad.errors, status: :unprocessable_entity
	end
  end
  
  # User
  def index
	@actividad = Actividad.order(:id)
	respond_with @actividad
  end
  
  def show
	@actividad = Actividad.find(params[:id])
	respond_with @actividad
  end
  
  private
  
  def actividad_params
	 params.require(:actividad).permit(:nombre)
  end
    
end

