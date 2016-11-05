class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  after_create :set_fechaini
  has_many :pagos
  has_many :packs
  has_many :actividades, through: :packs
  has_many :asistencias
  has_many :clases, through: :asistencias
  has_many :wait_lists
  has_many :wait_clases, through: :wait_lists, source: :clase
  has_many :instructorados, class_name: "Clase", foreign_key: "instructor"
  has_many :reemplazoados, class_name: "Clase", foreign_key: "reemplazo"  
  before_destroy :destroy_related
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, omniauth_providers: [:twitter, :facebook]
	
  def as_json(options = { })
	h = super(options)
	h[:packs] = self.packs
	h[:nombre_completo] = self.nombre_completo
	h
  end
  
  def nombre_completo
	if !self.nombre.nil? and !self.apellido.nil?
		return self.nombre+" "+self.apellido
	else
		return self.email
	end
  end
  
  def label
	if !self.nombre.nil? and !self.apellido.nil?
		return self.nombre+" "+self.apellido+" ("+self.email+")"
	else
		return self.email
	end
  end
 
  def remove_from_clase(clase)
	asistencias.where(:clase_id => clase.id).first.destroy if asistencias.where(:clase_id => clase.id).count > 0
  end
 
  def self.find_for_oauth(auth, signed_in_resource = nil)
    identity = Identity.find_for_oauth(auth)
    user = signed_in_resource ? signed_in_resource : identity.user
 
    if user.nil?
      email = auth.info.email
      user = User.find_by(email: email) if email
 
      # Create the user if it's a new registration
      if user.nil?
        password = Devise.friendly_token[0,20]
        if auth.provider == 'facebook'
          user = User.new(
            email: email ? email : "#{auth.uid}@change-me.com",
            password: password,
            password_confirmation: password
          )
        elsif auth.provider == 'twitter'
          user = User.new(
            email: "#{auth.uid}@change-me.com",
            password: password,
            password_confirmation: password
          )
        end
      end
      user.save!
    end
 
    if identity.user != user
      identity.user = user
      identity.save!
    end
    
    user
  end
 
  def email_verified?
    if self.email
      if self.email.split('@')[1] == 'change-me.com'
        return false
      else
        return true
      end
    else
      return false
    end
  end
  
  private
  def set_fechaini
	self.update_attribute(:fechaini,Date.today)
  end
  
  private
  def destroy_related
	asistencias.each{|x| x.destroy}	
	wait_lists.each{|x| x.destroy}		
	packs.each{|x| x.destroy}		
  end
end
