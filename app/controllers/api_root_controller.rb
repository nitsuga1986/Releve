class ApiRootController < ApplicationController

	def index
		url = request.path_info
		if !url.include?('join')
			if !current_user.try(:admin?)
				redirect_to root_path
			end
		end
	end
  
end
