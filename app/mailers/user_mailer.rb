class UserMailer < ActionMailer::Base
  default from: "agustinmancenido@gmail.com"
  
  def welcome_email(user)
    @user = user
    mail(to: @user.email, subject: 'Te damos la bienveida a Releve Pilates!')
  end

end
