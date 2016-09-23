class WaitList < ActiveRecord::Base
	belongs_to :user
	belongs_to :clase
	
	def as_json(options = { })
		h = super(options)
		h[:user] = self.user
		h
	end
	
end
