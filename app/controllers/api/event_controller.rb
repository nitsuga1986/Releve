class Api::EventController < ApplicationController
  before_action :authenticate_user!
  # Admin & Instructor
  before_action only: [:index] do redirect_to :new_user_session_path unless current_user && current_user.admin?   end
  # Api render
  respond_to :json

  # Admin
  def index
		@event = Event.order(id: :desc)
		respond_with @event
  end
end

