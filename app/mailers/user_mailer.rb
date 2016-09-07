class UserMailer < ActionMailer::Base
  default from: "agustinmancenido@gmail.com"
  
  def welcome_email(user)
    @user = user
    mail(to: @user.email, subject: 'Te damos la bienvenida a Releve Pilates!')
  end
  
  def join_email(user,clase)
    @user = user
    @clase = clase
    mail(to: @user.email, subject: 'Te esperamos para la clase de '+clase.actividad.nombre+' del  a las '+clase.horario+' con '+clase.instructor)
  end
  
  def unjoin_email(user,clase)
    @user = user
    @clase = clase
    mail(to: @user.email, subject: 'Te damos la bienvenida a Releve Pilates!')
  end

end
