class Pago < ActiveRecord::Base
	belongs_to :user
	belongs_to :actividad
	
	scope :total_by_mes, ->(mes) { where('mes=?',mes).collect{|x| x.monto}.inject(0, :+)  if mes.present?}

	
	def as_json(options = { })
		h = super(options)
		h[:user] = self.user
		h[:actividad] = self.actividad
		h
	end
	
end
