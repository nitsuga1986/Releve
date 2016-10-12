class UsersController < ApplicationController

  def finish_signup
	@preloadQuote = ["Roma no fue construida en una hora. Por lo que paciencia y persistencia son cualidades imprescindibles en el logro de cualquier esfuerzo que merezca la pena","La verdadera flexibilidad sólo puede conseguirse cuando la musculatura está uniformemente desarrollada","Sería un grave error pensar que sólo hacer ejercicio es suficiente para lograr el completo bienestar físico. La persona que cuide su alimentación y hábitos de sueño y que se ejercite correctamente estará tomando la mejor medicina preventiva","La correcta alineación y postura sólo será posible cuando el mecanismo completo de funcionamiento del cuerpo esté bajo control","Cada uno somos arquitectos de nuestra propia vida.","La primera lección es aprender a respirar correctamente. Para mejorar la respiración del individuo, es insuficiente decirle simplemente inspira y exhala. Sólo cuando se entiende el funcionamiento de la correcta respiración puede transmitirse adecuadamente","Los hábitos incorrectos en el día a día son los responsables de la mayoría de las dolencias"].sample
    if request.patch? && params[:user] # Revisa si el request es de tipo patch, es decir, llenaron el formulario y lo ingresaron
      @user = User.find(params[:id])
      if params[:user][:nombre].present? && params[:user][:apellido].present? && params[:user][:email].present? && params[:user][:telefono].present? && params[:user][:reminders].present? && params[:user][:accept_terms].present? && params[:user][:accept_terms]=="1"
		@user.update(user_params)
		UserMailer.welcome_email(@user).deliver if @user.confirmed == false
		@user.update_attribute(:confirmed, true)
		Event.create(name:'finish_signup',content: "<strong>"+@user.nombre_completo+"</strong> ha completado su registro correctamente")
        bypass_sign_in(@user)
        redirect_to '/app/agenda/', notice: 'Hemos guardado tu email correctamente.'
        return
      else
		@show_errors = true
      end
    end
	@landingpage=true
	render 'landing/finish_signup'
  end
 
  private
    def user_params
      accessible = [:nombre, :apellido, :email, :telefono, :reminders, :accept_terms]
      accessible << [ :password, :password_confirmation ] unless params[:user][:password].blank?
      params.require(:user).permit(accessible)
    end
end




    
