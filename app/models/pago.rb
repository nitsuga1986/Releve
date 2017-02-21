class Pago < ActiveRecord::Base
	belongs_to :user
	belongs_to :actividad
	
	belongs_to :cobrador, class_name: "User", foreign_key: "cobrador"
	
	scope :recent, ->() { where('created_at >= ?', 1.month.ago) }
	scope :cobrador, ->(user) { where('cobrador = ?', user) if user.present? }
	scope :total_by_mes, ->(mes) { where('mes=?',mes).collect{|x| x.monto}.inject(0, :+)  if mes.present?}

	
	def as_json(options = { })
		h = super(options)
		h[:user] = self.user
		h[:cobrador] = self.cobrador
		h[:actividad] = self.actividad
		h
	end
	
end
