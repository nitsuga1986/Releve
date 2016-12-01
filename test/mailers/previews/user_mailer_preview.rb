class UserMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/welcome_email
  def welcome_email
    user = User.first
    UserMailer.welcome_email(user)
  end
  
  def join_email
    user = User.first
    clase = Clase.first
    UserMailer.join_email(user,clase)
  end
  
  def join_multiple_email
    user = User.first
    clases = Clase.first(6)
    UserMailer.join_multiple_email(user,clases)
  end
  
  def unjoin_multiple_email
    user = User.first
    clases = Clase.first(6)
    UserMailer.unjoin_multiple_email(user,clases)
  end
  
  def unjoin_email
    user = User.first
    clase = Clase.first
    UserMailer.unjoin_email(user,clase)
  end
  
  def unjoin_comment_email
    user = User.first
    clase = Clase.first
	comentario = "Este es un comentario de prueba para el preview de los mailers"
    UserMailer.unjoin_comment_email(user,clase,comentario)
  end
  
  def pricing_email
	UserMailer.pricing_email('agustinmanenido@gmail.com','Agustín','Manceñido')
  end
  
  def remainder_email
    user = User.first
	start_date = Date.today
	end_date = start_date + 7.days
    clases = User.first.clases.where(:fecha => start_date..end_date).order(:fecha,:horario)
    UserMailer.remainder_email(user,clases)
  end
	
  def waitlist_email
    clase = Clase.first
    UserMailer.waitlist_email(clase)
  end
  
end
