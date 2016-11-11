class ApiRootController < ApplicationController

	def index
		if user_signed_in?
			url = request.path_info
			if !url.include?('app')
				if !(current_user.try(:instructor?) || current_user.try(:admin?))
					head :unauthorized
				end
			end
		else
			redirect_to new_user_session_path
		end
	end
  
end
