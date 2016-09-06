class Api::ActividadController < ApplicationController
  before_action :authenticate_user!
  respond_to :json
  
	def index
		@actividad = Actividad.all
		respond_with @actividad
	end

	def show
		@actividad = Actividad.find(params[:id])
		respond_with @actividad
	end

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

	def update
		@actividad = Actividad.find(params[:id])
		if @actividad.update_attributes(params.permit(:nombre)) then
			head :no_content
		else
			render json: @actividad.errors, status: :unprocessable_entity
		end
	end

	def destroy
		@actividad = Actividad.find(params[:id])    
		@actividad.destroy
		head :no_content
	end
end

