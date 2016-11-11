class Api::ActividadController < ApplicationController
  before_action :authenticate_user!
  # Admin
  before_action only: [:create, :destroy] do head :unauthorized unless current_user && current_user.admin?   end
  # Admin & Instructor
  before_action only: [:update] do redirect_to :new_user_session_path unless current_user && (current_user.instructor?||current_user.admin?)   end
  # Api render
  respond_to :json
  # ETAG -fresh_when()- is a key we use to determine whether a page has changed.
  etag { current_user.id }
  
  # Admin
  def create
	if !@actividad = Actividad.find_by(nombre: params[:nombre]) then
		@actividad = Actividad.new(actividad_params)
		if @actividad.save then
			render 'api/actividad/show', status: :created
		else
			render json: @actividad.errors, status: :internal_server_error
		end
	else
		render 'api/actividad/show', status: :conflict
	end
  end
  
  def destroy
	Actividad.destroy(params[:id])
	head :ok
  end
  
  # Instructor
  def update
	@actividad = Actividad.find(params[:id])
	if @actividad.update_attributes(actividad_params) then
		head :ok
	else
		render json: @actividad.errors, status: :internal_server_error
	end
  end
  
  # User
  def index
	@actividades = Actividad.order(:id)
	fresh_when(@actividades)
  end
  
  def show
	@actividad = Actividad.find(params[:id])
	fresh_when(@actividad)
  end
  
  private
  
  def actividad_params
	 params.require(:actividad).permit(:nombre)
  end
    
end

