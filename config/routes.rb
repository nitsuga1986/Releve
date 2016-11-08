Rails.application.routes.draw do

	namespace "api" do
		resources :actividad, :event,:pago
		resources :alumnos do
			collection do
				get 'autocomplete'
				post 'current'
				post 'instructores'
				put 'update_current'
			end
			member do
				post 'usr_clases'
				post 'usr_pagos'
			end
		end
		resources :clases do
			collection do
				get 'search'
				post 'bulk'
				post 'edit_bulk'
				post 'instructor'
				get 'index_usr'
				get 'history_usr'
				post 'join_multiple'
				post 'join_usr_multiple'
				get 'test_emails'
			end
			member do
				post 'join'
				post 'unjoin'
				post 'confirm'
				post 'unconfirm'
				post 'waitlist'
			end
		end
	end
	
	match '/app/(*all)' => 'api_root#index', via: [:get], as: :usr_app
	match '/clase/*all' => 'api_root#index', via: [:get], as: :clase_index
	match '/alumno/*all' => 'api_root#index', via: [:get], as: :alumno_index
	match '/actividad/*all' => 'api_root#index', via: [:get], as: :actividad_index
	match '/pago/*all' => 'api_root#index', via: [:get], as: :pago_index
	match '/eventos/*all' => 'api_root#index', via: [:get], as: :events_index
	
	match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], as: :finish_signup
	match '/terminos_y_condiciones' => 'landing#terms', via: [:get], as: :terms
	match '/pricing' => 'landing#pricing', via: [:post], as: :pricing, :defaults => { :format => 'json' }

	devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks', registrations: "users/registrations" }
	root "landing#index"
end
