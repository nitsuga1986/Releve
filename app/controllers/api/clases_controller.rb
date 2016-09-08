class Api::ClasesController < ApplicationController
  before_action :authenticate_user!
  respond_to :json

  def index
	@clase = Clase.all
	render json:  @clase
  end

  def show
	if current_user.try(:admin?)
		@clase = Clase.find(params[:id])
		render json:  @clase
	else
		redirect_to root_path
	end
  end
  
  def search
	@clase = Clase.find_by_fecha_and_horario(params[:fecha],params[:horario])
	if !@clase.nil? then
		render json:  @clase
	else
		head :no_content
	end
  end

  def join 
	@clase = Clase.find(params[:id])
	@clase.add_asistencia(current_user.id)
	UserMailer.join_email(current_user,@clase).deliver
	render json: @clase, status: :created
  end
  
  def unjoin 
	@clase = Clase.find(params[:id])
	current_user.remove_from_clase(@clase)
	UserMailer.unjoin_email(current_user,@clase).deliver
	render json: @clase, status: :created
  end
  
  def create
	if !@clase = Clase.find_by_fecha_and_horario(params[:fecha],params[:horario]) then
		@clase = Clase.new(params.permit(:fecha, :horario, :max_users, :cancelada, :comment))
		@clase.actividad = Actividad.find(params[:actividad_id])
		@clase.instructor = User.find(params[:instructor_id])
		if @clase.save then
			if !params[:users].nil? then
				params[:users].each do |user|
					@clase.add_asistencia(user[:id]) if user[:id]	
				end
			end
			render json: @clase, status: :created
		else
			render json: @clase.errors, status: :unprocessable_entity
		end
	else
		render json: @clase, status: :conflict
	end
  end
  
  def bulk
	if params[:fecha_start].present? && params[:fecha_end].present? && params[:horario].present? && params[:max_users].present? && params[:instructor_id].present? && params[:actividad_id].present? then
		Date.parse(params[:fecha_start]).upto(Date.parse(params[:fecha_end])) do |date|
			if (params[:bool_monday]==true && date.wday==1)||(params[:bool_tuesday]==true && date.wday==2)||(params[:bool_wednesday]==true && date.wday==3)||(params[:bool_thursday]==true && date.wday==4)||(params[:bool_friday]==true && date.wday==5)||(params[:bool_saturday]==true && date.wday==6)||(params[:bool_sunday]==true && date.wday==0) then
				logger.debug(date)
				if !@clase = Clase.find_by_fecha_and_horario(date.strftime("%Y-%m-%d"),params[:horario]) then
					params[:fecha] = date.strftime("%Y-%m-%d")
					@clase = Clase.new(params.permit(:fecha, :horario, :max_users))
					@clase.actividad = Actividad.find(params[:actividad_id])
					@clase.instructor = User.find(params[:instructor_id])
					if @clase.save then
						if !params[:users].nil? then
							params[:users].each do |user|
								@clase.add_asistencia(user[:id]) if user[:id]	
							end
						end
					end
				end
			end
		end
		render json: @clase, status: :created
	else
		render json: {
			error: "Missing data",
			status: :unprocessable_entity
		}
	end
  end

  def update
	@clase = Clase.find(params[:id])
	if params[:users].nil? then
		@clase.users.each{|x| x.remove_from_clase(@clase)}
	else
		@clase.users.each{|x| x.remove_from_clase(@clase) if !params[:users].map{|y| y[:id]}.include? x.id }
	end
	@clase.actividad = Actividad.find(params[:actividad_id])
	if @clase.update_attributes(params.permit(:fecha, :horario, :max_users, :instructor, :cancelada, :comment)) then
		if !params[:users].nil? then
			params[:users].each do |user|
				@clase.add_asistencia(user[:id]) if user[:id]	
			end
		end
		head :no_content
	else
		render json: @clase.errors, status: :unprocessable_entity
	end
  end

  def destroy
	@clase = Clase.find(params[:id])    
	@clase.destroy
	head :no_content
  end
  
end
