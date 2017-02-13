class Event < ActiveRecord::Base
  validate :count_within_limit, :on => :create
  scope :not_permanent, -> { where.not(name: ['pricing','finish_signup','payment']) }
  
  def count_within_limit
    if Event.all.count >= 400
		Event.not_permanent.first.destroy
    end
  end
  
end
