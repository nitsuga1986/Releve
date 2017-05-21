class Event < ActiveRecord::Base
  validate :count_within_limit, :on => :create
  scope :not_permanent, -> { where.not(name: ['pricing','finish_signup','payment']) }
  
  def count_within_limit
    if Event.all.count >= 800
		#Event.not_permanent.first.destroy
		Event.first.destroy
    end
  end
  
end
