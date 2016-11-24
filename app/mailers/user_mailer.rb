class UserMailer < ActionMailer::Base
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

	def unjoin_comment_email(user,clase,comentario)
		@user = user
		@clase = clase
		@comentario = comentario
		mail(to: 'relevepilates@gmail.com', subject: user.nombre_completo+' dejó un comentario al cancelar la clase del '+I18n.t('date.day_names')[@clase.fecha.wday]+' '+@clase.fecha.strftime("%d/%m/%Y")+' a las '+clase.horario+' con '+clase.instructor.nombre_completo)
	end
	
	def waitlist_email(clase)
		@clase = clase
		emails = clase.wait_users.collect(&:email).join(",")
		mail(to: 'relevepilates@gmail.com', bcc: emails,  subject: 'Tenemos un lugar para vos!')
	end

	def pricing_email(email,nombre,apellido)
		@nombre = nombre
		@apellido = apellido
		mail(to: email, subject: 'Info Releve')
	end

	def remainder_email(user,clases)
		@user = user
		@clases = clases
		mail(to: @user.email, subject: 'Tu semana Releve!')
	end

	def newsletter_email(recipient, mail_subject, mail_title, mail_pretext, mail_body, mail_button_text, mail_button_link, mail_subtitle, mail_subbody, include_reminder)
		case recipient
			when "all" then recipients = email_list(User.all)
			when "reminders" then recipients = email_list(User.remaindable)
			when "newsletter" then recipients = email_list(User.newsletterable)
			when "test" then recipients = ""
			else recipients = recipient
		end
		@mail_title = mail_title
		@mail_body = mail_body
		@mail_pretext = mail_pretext
		@mail_button_text = mail_button_text
		@mail_button_link = mail_button_link
		@mail_subtitle = mail_subtitle
		@mail_subbody = mail_subbody
		@include_reminder = include_reminder
		mail(to: 'relevepilates@gmail.com', bcc: recipients,  subject: mail_subject)
	end
	
	private
	
	def email_list(users)
		users.collect(&:email).join(",")
	end
	
end
