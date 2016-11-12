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
	@pago = Pago.new(pago_params)
	if @pago.save then
		register_event('payment', @pago.user.nombre_completo+" abonó $"+@pago.monto.to_s+" por "+@pago.cant_clases.to_s+" clases de "+I18n.t('date.month_names')[@pago.mes-1]+" (cobró "+current_user.nombre_completo+")")
		render 'api/pago/show', status: :created
	else
		render json: @pago.errors, status: :internal_server_error
	end
  end
  
  def destroy
	Pago.destroy(params[:id])
	head :ok
  end
  
  def update
	@pago = Pago.find(params[:id])
	if @pago.update_attributes(pago_params) then
		head :ok
	else
		render json: @pago.errors, status: :internal_server_error
	end
  end
  
  def index
	@pagos = Pago.order(id: :desc)
	fresh_when(@pagos)
  end
  
  def index_user
	@pagos = User.find(params[:id]).pagos.order(id: :desc)
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

