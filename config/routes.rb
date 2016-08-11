Rails.application.routes.draw do


	namespace "api" do
		resources :clases do
			collection do
				get 'autocomplete'
				get 'search'
			end
		end
	end
	match '/dashboard/*all' => 'api_root#index', via: [:get], as: :clases_index
	match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], as: :finish_signup
	devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }
	root "landing#index"
	
end
