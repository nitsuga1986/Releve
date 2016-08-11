class ApiRootController < ApplicationController

  def index
	if current_user.try(:admin?)
	else
		redirect_to root_path
	end
  end
  
end
