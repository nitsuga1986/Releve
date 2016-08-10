Rails.application.routes.draw do


  resources :clases do
	collection do
		get 'autocomplete'
	end
  end
  match '/admin/*all' => 'admin#index', via: [:get, :patch], as: :admin
  match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], as: :finish_signup
  devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }
  get 'landing/index'
  root "landing#index"
end
