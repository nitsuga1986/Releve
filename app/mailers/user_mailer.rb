class UserMailer < ActionMailer::Base
	layout 'mailer'
	default from: "relevepilates@gmail.com"

	def welcome_email(user)
		@user = user
		mail(to: @user.email, subject: 'Te damos la bienvenida a Releve Pilates!')
	end

	def join_email(user,clase)
		@user = user
		@clase = clase
		mail(to: @user.email, subject: 'Agendado: '+clase.actividad.nombre+' el '+I18n.t('date.day_names')[@clase.fecha.wday]+' '+@clase.fecha.strftime("%d/%m/%Y")+' a las '+clase.horario+' con '+clase.instructor.nombre_completo)
	end

	def join_multiple_email(user,clases)
		@user = user
		@clases = clases
		mail(to: @user.email, subject: 'Hemos agendado tus clases')
	end

	def unjoin_email(user,clase)
		@user = user
		@clase = clase
		mail(to: @user.email, subject: 'Inscripción cancelada: '+clase.actividad.nombre+' el '+I18n.t('date.day_names')[@clase.fecha.wday]+' '+@clase.fecha.strftime("%d/%m/%Y")+' a las '+clase.horario+' con '+clase.instructor.nombre_completo)
	end

	def pricing_email(email,nombre,apellido)
		@nombre = nombre
		@apellido = apellido
		mail(to: email, subject: 'Info Releve')
	end

	def remainder_email(user)
		@user = user
		@clases = user.clases.order(:fecha,:horario)
		mail(to: @user.email, subject: 'Tu semana Releve!')
	end
	
end
