Rails.application.routes.draw do

	namespace "api" do
		resources :alumnos do
			collection do
				get 'autocomplete'
			end
		end
		resources :actividad
		resources :clases do
			collection do
				get 'search'
				post 'bulk'
			end
			member do
				get 'join'
				get 'unjoin'
			end
		end
	end
	
	match '/dashboard/*all' => 'api_root#index', via: [:get], as: :clases_index
	match '/alumno/*all' => 'api_root#index', via: [:get], as: :alumnos_index
	match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], as: :finish_signup

	devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }
	root "landing#index"
	
end
