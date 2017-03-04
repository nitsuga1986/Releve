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

	when 'asistencias'
		stats = []
		stat_anotados = []
		stat_presentes = []
		horarios = Clase.all.map(&:horario).uniq.sort!
		horarios.each do |horario|
			cant_clases = Clase.recent_months(3).by_horario(horario).count.to_f
			total_anotados = Clase.recent_months(3).total_by_horario(horario).to_f
			total_presentes = Clase.recent_months(3).total_by_horario_and_confirmed(horario,true).to_f
			stat_presentes.push(total_presentes/cant_clases)
			stat_anotados.push(total_anotados/cant_clases - total_presentes/cant_clases)
		end
		stats.push(stat_presentes)
		stats.push(stat_anotados)
		@stats['stats'] = stats
		@stats['labels'] = horarios
		@stats['series'] =  ['Presentes', 'Ausentes']
		render json: @stats
		
	else
	  head :ok
	end
	
  end

  
end

