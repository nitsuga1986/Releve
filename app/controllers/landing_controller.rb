class LandingController < ApplicationController
	def index
		@landingpage=true
		@nextclases = Clase.where('fecha > ?', DateTime.now).order("fecha ASC, horario ASC").limit(9)
		@preloadQuote = ["Roma no fue construida en una hora. Por lo que paciencia y persistencia son cualidades imprescindibles en el logro de cualquier esfuerzo que merezca la pena","La verdadera flexibilidad sólo puede conseguirse cuando la musculatura está uniformemente desarrollada","Sería un grave error pensar que sólo hacer ejercicio es suficiente para lograr el completo bienestar físico. La persona que cuide su alimentación y hábitos de sueño y que se ejercite correctamente estará tomando la mejor medicina preventiva","La correcta alineación y postura sólo será posible cuando el mecanismo completo de funcionamiento del cuerpo esté bajo control","Cada uno somos arquitectos de nuestra propia vida.","La primera lección es aprender a respirar correctamente. Para mejorar la respiración del individuo, es insuficiente decirle simplemente inspira y exhala. Sólo cuando se entiende el funcionamiento de la correcta respiración puede transmitirse adecuadamente","Los hábitos incorrectos en el día a día son los responsables de la mayoría de las dolencias"].sample
	end

	def terms
	end

	def pricing
		if params[:email].present? && params[:firstname].present? && params[:lastname].present?
			if verify_recaptcha
				UserMailer.pricing_email(params[:email],params[:firstname],params[:lastname]).deliver
				render json: {message: "ok"}, status: :ok 
				return
			else
				render json: {message: "bad_captcha"}, status: :bad_request
				return
			end
		end
		render json: {message: "bad_request"}, status: :bad_request
	end
  
end
