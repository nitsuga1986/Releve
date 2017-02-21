class Api::PagoController < ApplicationController
  before_action :authenticate_user!
  # Admin & Instructor
  before_action only: [:create, :destroy, :update, :index, :show] do head :unauthorized unless current_user && (current_user.instructor?||current_user.admin?)   end
  # Api render
  respond_to :json
  # ETAG -fresh_when()- is a key we use to determine whether a page has changed.
  etag { current_user.id }

  # Instructor
  def create
	if params[:user_id].present? and params[:monto].present? then
		@pago = Pago.new(pago_params)
		@pago.cobrador = current_user
		if @pago.save then
			register_event('payment', @pago.user.nombre_completo+" abonó $"+@pago.monto.to_s+" por "+@pago.cant_clases.to_s+" clases de "+I18n.t('date.month_names')[@pago.mes]+" (cobró "+current_user.nombre_completo+")")
			render 'api/pago/show', status: :created
		else
			render json: @pago.errors, status: :internal_server_error
		end
	else
		head :forbidden
	end
  end
  
  def destroy
	@pago = Pago.find(params[:id])
	if Pago.destroy(params[:id]) then
		register_event('payment', "[Pago eliminado] De "+@pago.user.nombre_completo+" $"+@pago.monto.to_s+" por "+@pago.cant_clases.to_s+" clases de "+I18n.t('date.month_names')[@pago.mes]+" (eliminado por "+current_user.nombre_completo+")")
	end
	head :ok
  end
  
  def update
	@pago = Pago.find(params[:id])
	if params[:user_id].present? and params[:monto].present? then
		if @pago.update_attributes(pago_params) then
			register_event('payment', "[Modificado] "+@pago.user.nombre_completo+" abonó $"+@pago.monto.to_s+" por "+@pago.cant_clases.to_s+" clases de "+I18n.t('date.month_names')[@pago.mes]+" (cobró "+current_user.nombre_completo+")")
			head :ok
		else
			render json: @pago.errors, status: :internal_server_error
		end
	else
		head :forbidden
	end
  end
  
  def index
	if current_user.admin? then
		@pagos = Pago.order(id: :desc)
	else
		# Cobrador agregado el 21/02 esperar un mes para cambiar el query
		#@pagos = Pago.cobrador(current_user).order(id: :desc)
		@pagos = Pago.recent.order(id: :desc)
	end
	fresh_when(@pagos)
  end
  
  def index_user
	if current_user.admin? then
		@pagos = User.find(params[:id]).pagos.order(id: :desc)
	else
		@pagos = User.find(params[:id]).pagos.recent.order(id: :desc)
	end
	fresh_when(@pagos)
  end
  
  def show
	@pago = Pago.find(params[:id])
	fresh_when(@pago)
  end
  
  private
  
  def pago_params
	 params.require(:pago).permit(:user_id, :monto, :cant_clases, :actividad_id, :mes, :fecha)
  end

  def register_event(name,content)
	Event.create(name: name,content: content)
  end
  
end

