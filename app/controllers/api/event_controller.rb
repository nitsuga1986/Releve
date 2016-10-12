class Api::EventController < ApplicationController
  before_action :authenticate_user!
  before_action only: [:index] do redirect_to :new_user_session_path unless current_user && current_user.admin?   end
  
  respond_to :json

  # ADMIN
  ###########################
  def index
		@event = Event.all.order("id DESC")
		respond_with @event
  end
end

