class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  if user_signed_in? && !current_user.confirmed?
	@show_confirm_form = true
  end
  
end
