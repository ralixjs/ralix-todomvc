Rails.application.routes.draw do
  get 'index', to: 'todos#index'
  root 'todos#index'
end
