class ClasesController < ApplicationController
  before_action :authenticate_user!
  respond_to :json

  def index
    @clases = Clase.all
    respond_with(@clases)
  end

  def show
    @clase = Clase.find(params[:id])
	respond_with @clase
  end
  
  def autocomplete
	like= "%".concat(params[:term].concat("%"))
	@users = User.where("email like ?", like)
	list = @users.map {|u| Hash[ id: u.id, email: u.email]}
	render json: list
  end

  def create
	if !@clase = Clase.find_by_fecha_and_by_horario(params[:fecha],params[:horario]) then
		@clase = Clase.new(params.permit(:fecha, :horario, :max_users, :instructor, :cancelada, :comment))
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

  def update
	@clase = Clase.find(params[:id])
	if params[:users].nil? then
		@clase.users.each{|x| x.remove_from_clase(@clase)}
	else
		@clase.users.each{|x| x.remove_from_clase(@clase) if !params[:users].map{|y| y[:id]}.include? x.id }
	end
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
