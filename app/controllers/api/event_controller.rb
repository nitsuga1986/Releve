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
	when 'asistencias'
		@chartData = [['Horarios','Inscriptos', 'Presentes', { role: 'annotation' } ]]
		Clase.all.map(&:horario).uniq.sort!.each do |horario|
			total_anotados = Clase.total_by_horario(horario)
			total_presentes = Clase.total_by_horario(horario)
			@chartData.push([horario, total_anotados, total_presentes,''])
		end
		@stats['stats'] = @chartData
		render json: @stats
		
	when 'ingresos'
		stats = []
		(1..12).each do |mes| 
			stats.push(Pago.last_year.total_by_mes(mes)) 
		end
		@stats['stats'] = stats
		@stats['labels'] = I18n.t('date.month_names').drop(1)
		render json: @stats
	else
	  head :ok
	end
	
  end

  
end

