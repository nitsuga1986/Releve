class ClasesController < ApplicationController
  before_action :set_clase, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @clases = Clase.all
    respond_with(@clases)
  end

  def show
    respond_with(@clase)
  end

  def new
    @clase = Clase.new
    respond_with(@clase)
  end

  def edit
  end
  
  def autocomplete
	like= "%".concat(params[:term].concat("%"))
	@users = User.where("email like ?", like)
	list = @users.map {|u| Hash[ id: u.id, email: u.email]}
	render json: list
  end

  def create
	if !@clase = Clase.find_by_fecha_and_by_horario(params[:fecha],params[:horario]) then
		@clase = Clase.new(clase_params)
		if @clase.save then
			if !params[:users].nil? then
				params[:users].each do |user|
					@clase.add_asistencia(user[:id]) if user[:id]	
				end
			end
			render json: @clase, status: :created #, location: @clase
		else
			render json: @clase.errors, status: :unprocessable_entity
		end
	else
		render json: @clase, status: :conflict
	end
  end

  def update
    @clase.update(clase_params)
    respond_with(@clase)
  end

  def destroy
    @clase.destroy
    respond_with(@clase)
  end

  private
    def set_clase
      @clase = Clase.find(params[:id])
    end

    def clase_params
      params.require(:clase).permit(:user_id, :fecha, :horario, :max_users, :instructor, :cancelada, :comment)
    end
end
