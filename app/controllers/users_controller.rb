class UsersController < ApplicationController

  def finish_signup
	@preloadQuote = ["La buena condición física es el primer requisito para la felicidad","Roma no fue construida en una hora. Por lo que paciencia y persistencia son cualidades imprescindibles en el logro de cualquier esfuerzo que merezca la pena","El desarrollo de los músculos profundos ayuda naturalmente al desarrollo de los músculos más grandes, de la misma manera que pequeños ladrillos construyen grandes edificios","La verdadera flexibilidad sólo puede conseguirse cuando la musculatura está uniformemente desarrollada","Eres tan joven o tan viejo como te sientes. Si tu espalda es rígida con 30 años, entonces eres viejo. Si consigues que sea móvil y flexible a los 60, entonces te seguirás manteniendo joven","Sería un grave error pensar que sólo hacer ejercicio es suficiente para lograr el completo bienestar físico. La persona que cuide su alimentación y hábitos de sueño y que se ejercite correctamente estará tomando la mejor medicina preventiva","La correcta alineación y postura sólo será posible cuando el mecanismo completo de funcionamiento del cuerpo esté bajo control","Cada uno somos arquitectos de nuestra propia vida. Y la felicidad está subordinada al bienestar físico por encima del nivel social o el estatus económico","La primera lección es aprender a respirar correctamente. Para mejorar la respiración del individuo, es insuficiente decirle simplemente inspira y exhala. Sólo cuando se entiende el funcionamiento de la correcta respiración puede transmitirse adecuadamente","La respiración es la primera acción que realizamos en la vida, y la última. Una respiración vaga e incompleta te acerca a la enfermedad","Los hábitos incorrectos en el día a día son los responsables de la mayoría de las dolencias","En su condición normal, el niño no necesita el estímulo artificial del ejercicio. Es el hecho de vivir en un contexto artificial lo que supone que haya que guiarle en busca del control consciente de su cuerpo para a partir de ahí transformarlo en hábitos para convertirlos en rutinas inconscientes","Existen determinados comportamientos que no sólo condicionan sino que perjudican el correcto desarrollo del niño como"].sample
    if request.patch? && params[:user] # Revisa si el request es de tipo patch, es decir, llenaron el formulario y lo ingresaron
      @user = User.find(params[:id])
      if params[:user][:email].present? && params[:user][:telefono].present? && params[:user][:reminders].present? && params[:user][:accept_terms].present? && params[:user][:accept_terms]=="1"
		@user.update(user_params)
		UserMailer.welcome_email(@user).deliver if @user.confirmed == false
		rescue Net::SMTPAuthenticationError, Net::SMTPServerBusy, Net::SMTPSyntaxError, Net::SMTPFatalError, Net::SMTPUnknownError => e
			logger.debug("Problems sending mail")
			logger.debug(e)
		end
		@user.update_attribute(:confirmed, true)
        bypass_sign_in(@user)
        redirect_to '/app/agenda/', notice: 'Hemos guardado tu email correctamente.'
      else
		@show_errors = true
		render 'landing/finish_signup'
      end
    else
		@landingpage=true
		render 'landing/finish_signup'
    end
  end
 
  private
    def user_params
      accessible = [:email, :telefono, :reminders, :accept_terms]
      accessible << [ :password, :password_confirmation ] unless params[:user][:password].blank?
      params.require(:user).permit(accessible)
    end
end




    
