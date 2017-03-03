class Api::EventController < ApplicationController
  before_action :authenticate_user!
  # Admin & Instructor
  before_action only: [:index] do head :unauthorized unless current_user && current_user.admin?   end
  # Api render
  respond_to :json
  # ETAG -fresh_when()- is a key we use to determine whether a page has changed.
  etag { current_user.id }
  
  # Admin
  def index
	@events = Event.order(id: :desc)
	fresh_when(@events)
  end

  def stats
	@stats = {}
	case params[:stat]
		
	when 'ingresos'
		stats = []
		(1..12).each do |mes| 
			stats.push(Pago.last_year.total_by_mes(mes)) 
		end
		@stats['stats'] = stats
		@stats['labels'] = I18n.t('date.month_names').drop(1)
		render json: @stats
	
	when 'clases_instructores'
		stats = []
		instructores = User.where(instructor:true).order(:id)
		instructores.each do |instructor|
			instructor_stat = []
			(1..12).each do |mes| 
				instructor_stat.push(Clase.by_instructor(instructor).by_month(mes).count)
			end
			stats.push(instructor_stat) 
		end
		@stats['stats'] = stats
		@stats['labels'] = I18n.t('date.month_names').drop(1)
		@stats['series'] =  instructores.collect {|user| user.nombre_completo }
		render json: @stats
		
	else
	  head :ok
	end
	
  end

  
end

