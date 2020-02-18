Rails.application.routes.draw do
  get 'index', to: 'todo#index'
  root 'todo#index'
end
