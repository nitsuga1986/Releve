class Api::PagoController < ApplicationController
  before_action :authenticate_user!
  # Admin & Instructor
  before_action only: [:create, :destroy, :update, :index, :show] do redirect_to :new_user_session_path unless current_user && (current_user.instructor?||current_user.admin?)   end
  # Api render
  respond_to :json

  # Instructor
  def create
	@pago = Pago.new(pago_params)
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
	if @pago.update_attributes(pago_params) then
		head :no_content
	else
		render json: @pago.errors, status: :unprocessable_entity
	end
  end
  
  def index
	@pagos = Pago.order(:id)
  end
  
  def show
	@pagos = Pago.find(params[:id])
	respond_with @pagos
  end
  
  private
  
  def pago_params
	 params.require(:pago).permit(:user_id, :monto, :cant_clases, :actividad_id, :mes, :fecha)
  end
  
end

