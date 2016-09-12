class Asistencia < ActiveRecord::Base
	belongs_to :user
	belongs_to :clase
end
