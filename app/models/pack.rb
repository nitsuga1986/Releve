class Pack < ActiveRecord::Base
	belongs_to :user
	belongs_to :actividad
	
	def as_json(options = { })
		h = super(options)
		h[:actividad] = self.actividad
		h
	end

end
