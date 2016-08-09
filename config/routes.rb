Rails.application.routes.draw do

  match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], as: :finish_signup
  devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }
  get 'landing/index'
  root "landing#index"
end
