Rails.application.routes.draw do

	namespace "api" do
		resources :alumnos do
			collection do
				get 'autocomplete'
				post 'current'
				post 'instructores'
			end
		end
		resources :actividad
		resources :clases do
			collection do
				get 'search'
				post 'bulk'
				get 'index_usr'
				get 'history_usr'
				post 'join_multiple'
			end
			member do
				post 'join'
				post 'unjoin'
				post 'waitlist'
				put 'update_current'
			end
		end
	end
	
	match '/app/*all' => 'api_root#index', via: [:get], as: :usr_app
	match '/clase/*all' => 'api_root#index', via: [:get], as: :clase_index
	match '/alumno/*all' => 'api_root#index', via: [:get], as: :alumno_index
	match '/actividad/*all' => 'api_root#index', via: [:get], as: :actividad_index
	
	match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], as: :finish_signup
	match '/terminos_y_condiciones' => 'landing#terms', via: [:get], as: :terms
	match '/pricing' => 'landing#pricing', via: [:post], as: :pricing, :defaults => { :format => 'json' }

	devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }
	root "landing#index"
	
end
