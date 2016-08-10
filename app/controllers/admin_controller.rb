class AdminController < ApplicationController
  def index
  @notlandingpage=true
	if current_user.try(:admin?)
	else
		redirect_to root_path
	end
  end
end
