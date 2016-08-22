class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  before_action :check_confirmed
  protect_from_forgery with: :exception

  private
 
  def check_confirmed
	  if user_signed_in? && !current_user.confirmed?
		@show_confirm_form = true
	  end
  end
  
	def after_sign_in_path_for(resource)
	  '/dashboard/join/'
	end

end
