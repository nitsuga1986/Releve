class Actividad < ActiveRecord::Base
	has_many :packs
	has_many :users, through: :packs
	before_destroy :destroy_packs

	def remove_user_from_actividad(user)
		packs.where(:user_id => user.id).first.destroy if packs.where(:user_id => user.id).count > 0
	end
	
	private
	def destroy_packs
		packs.each{|x| x.destroy}		
    end
end
