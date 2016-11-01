class Pago < ActiveRecord::Base
	belongs_to :user
	belongs_to :actividad
	
	def as_json(options = { })
		h = super(options)
		h[:user] = self.user
		h[:actividad] = self.actividad
		h
	end
	
end
