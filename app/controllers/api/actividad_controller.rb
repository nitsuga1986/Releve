class Api::ActividadController < ApplicationController
  before_action :authenticate_user!
  before_action only: [:create, :destroy] do redirect_to :new_user_session_path unless current_user && current_user.admin?   end
  before_action only: [:update] do redirect_to :new_user_session_path unless current_user && (current_user.instructor?||current_user.admin?)   end
  
  respond_to :json

  # ADMIN
  ###########################
  def create
	if !@actividad = Actividad.find_by_nombre(params[:nombre]) then
		@actividad = Actividad.new(params.permit(:nombre))
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
  
  # INSTRUCTOR
  ###########################
  def update
	@actividad = Actividad.find(params[:id])
	if @actividad.update_attributes(params.permit(:nombre)) then
		head :no_content
	else
		render json: @actividad.errors, status: :unprocessable_entity
	end
  end
  
  # USER
  ###########################
  def index
		@actividad = Actividad.all
		respond_with @actividad
  end
end

