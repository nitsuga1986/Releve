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
  
  def unjoin_email
    user = User.first
    clase = Clase.first
    UserMailer.unjoin_email(user,clase)
  end
  
  def pricing_email
	UserMailer.pricing_email('agustinmanenido@gmail.com','Agustín','Manceñido')
  end
  
  def remainder_email
    user = User.first
    clases = User.first.clases
    UserMailer.remainder_email(user)
  end
  
end
