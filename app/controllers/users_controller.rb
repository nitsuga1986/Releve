class UsersController < ApplicationController

  def finish_signup
    if request.patch? && params[:user] # Revisa si el request es de tipo patch, es decir, llenaron el formulario y lo ingresaron
      @user = User.find(params[:id])
      if params[:user][:email].present? && params[:user][:telefono].present?
		@user.update_attribute(:confirmed, true)
		@user.update(user_params)
        bypass_sign_in(@user)
        UserMailer.welcome_email(@user).deliver
        redirect_to '/dashboard/join/', notice: 'Hemos guardado tu email correctamente.'
      else
		@landingpage=true
        @show_errors = true
        render 'landing/index'
      end
    else
		@landingpage=true
		render 'landing/index'
    end
  end
 
  private
    def user_params
      accessible = [:email, :dni, :nombre, :apellido, :profesion, :fechanac, :fechaini, :telefono, :domicilio, :localidad, :nombre_contacto, :apellido_contacto, :telefono_contacto, :sexo] # extend with your own params
      accessible << [ :password, :password_confirmation ] unless params[:user][:password].blank?
      params.require(:user).permit(accessible)
    end
end




    
