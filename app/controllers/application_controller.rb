class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  before_filter :ensure_domain
  before_action :check_confirmed
  protect_from_forgery with: :exception

  private
 
  def check_confirmed
	  if user_signed_in? && !current_user.confirmed?
		@show_confirm_form = true
	  end
  end
  
  APP_DOMAIN = 'www.relevepilates.com.ar'
  def ensure_domain
    if request.env['HTTP_HOST'] != APP_DOMAIN
      redirect_to "http://#{APP_DOMAIN}", :status => 301	# HTTP 301 is a "permanent" redirect
    end
  end
end
