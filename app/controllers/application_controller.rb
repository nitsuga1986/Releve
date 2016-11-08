class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  before_action :check_confirmed
  protect_from_forgery with: :exception

  private
 
  def check_confirmed
	  if user_signed_in? && !current_user.confirmed? && params[:action] != "finish_signup" && params[:action] != "destroy"
		redirect_to finish_signup_url(current_user.id)
	  end
  end
  
end
