class Api::PagoController < ApplicationController
  before_action :authenticate_user!
  before_action only: [:create, :destroy, :update, :index, :show] do redirect_to :new_user_session_path unless current_user && (current_user.instructor?||current_user.admin?)   end
  
  respond_to :json

  # INSTRUCTOR
  ###########################
  def create
	@pago = Pago.new(params.permit(:user_id, :actividad_id, :monto, :cant_clases, :mes, :fecha))
	if @pago.save then
		Event.create(name:'payment',content: @pago.user.nombre_completo+" abonó $"+@pago.monto.to_s+" por "+@pago.cant_clases.to_s+" clases de "+I18n.t('date.month_names')[@pago.mes-1]+" (cobró "+current_user.nombre_completo+")")
		render json: @pago, status: :created #, location: @pago
	else
		render json: @pago.errors, status: :unprocessable_entity
	end
  end
  
  def destroy
	@pago = Pago.find(params[:id])
	@pago.destroy
	head :no_content
  end
  
  def update
	@pago = Pago.find(params[:id])
	if @pago.update_attributes(params.permit(:nombre)) then
		head :no_content
	else
		render json: @pago.errors, status: :unprocessable_entity
	end
  end
  
  def index
	@pagos = Pago.all.order(:id)
  end
  
  def show
	@pagos = Pago.find(params[:id])
	respond_with @pagos
  end
  
  # USER
  ###########################
  
end

