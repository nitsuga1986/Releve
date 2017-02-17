class Api::EventController < ApplicationController
  before_action :authenticate_user!
  # Admin & Instructor
  before_action only: [:index, :stats] do head :unauthorized unless current_user && current_user.admin?   end
  # Api render
  respond_to :json
  # ETAG -fresh_when()- is a key we use to determine whether a page has changed.
  etag { current_user.id }
  
  # Admin
  def index
	@events = Event.order(id: :desc)
	fresh_when(@events)
  end
  
  def stats
	@events = Event.order(id: :desc)
	fresh_when(@events)
	end
	
	
  end
  
end

