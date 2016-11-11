Rails.application.routes.draw do

	namespace "api" do
		resources :actividad, :event
		resources :pago do
			collection do
				get 'index_user'
			end
		end
		resources :alumnos do
			collection do
				get 'search'
				get 'autocomplete'
				post 'current'
				post 'instructores'
				put 'update_current'
			end
		end
		resources :clases do
			collection do
				get 'search'
				post 'bulk'
				post 'edit_bulk'
				post 'index_instructor'
				get 'index_usr'
				get 'history_usr'
				post 'join_multiple'
				post 'join_usr_multiple'
				post 'edit_asistencias'
				get 'index_user'
			end
			member do
				post 'join'
				post 'unjoin'
				post 'waitlist'
			end
		end
	end
	
	get '/app/(*all)' => 'api_root#index', as: :usr_app
	get '/clase/*all' => 'api_root#index', as: :clase_index
	get '/alumno/*all' => 'api_root#index', as: :alumno_index
	get '/actividad/*all' => 'api_root#index', as: :actividad_index
	get '/pago/*all' => 'api_root#index', as: :pago_index
	get '/eventos/*all' => 'api_root#index', as: :events_index
	get '/terminos_y_condiciones' => 'landing#terms', as: :terms
	match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], as: :finish_signup
	post '/pricing' => 'landing#pricing', as: :pricing, :defaults => { :format => 'json' }

	devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks', registrations: "users/registrations" }
	root "landing#index"
end
