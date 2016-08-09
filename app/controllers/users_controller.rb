class UsersController < ApplicationController
  def finish_signup
    @show_confirm_form = true
    if request.patch? && params[:user] # Revisa si el request es de tipo patch, es decir, llenaron el formulario y lo ingresaron
      @user = User.find(params[:id])
 
      if @user.update(user_params)
        sign_in(@user, :bypass => true)
        redirect_to root_path, notice: 'Hemos guardado tu email correctamente.'
      else
        @show_errors = true
        current_user.errors.full_messages.push("La dirección de correo no es correcta")
        logger.debug current_user.errors.full_messages
        logger.debug current_user.email
        logger.debug "AQUI----------------------------------------------------------------------"
        render 'landing/index'
      end
    else
		render 'landing/index'
    end
  end
 
  private
    def user_params
      accessible = [ :name, :email ] # extend with your own params
      accessible << [ :password, :password_confirmation ] unless params[:user][:password].blank?
      params.require(:user).permit(accessible)
    end
end
