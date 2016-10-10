class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  before_filter :correct_domain!
  before_action :check_confirmed
  protect_from_forgery with: :exception

  private
 
  def check_confirmed
	  if user_signed_in? && !current_user.confirmed?
		@show_confirm_form = true
	  end
  end
  def correct_domain!
    unless request.host == 'www.relevepilates.com.ar'
      redirect_to 'www.relevepilates.com.ar', :status => 301  # or explicitly 'http://www.mysite.com/'
    end
  end
  
end
