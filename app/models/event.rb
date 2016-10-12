class Event < ActiveRecord::Base
  validate :count_within_limit, :on => :create
  
  def count_within_limit
    if Event.all.count >= 100
		Event.first.destroy
    end
  end
  
end
