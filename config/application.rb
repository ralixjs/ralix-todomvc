require_relative 'boot'

require 'action_controller/railtie'
require 'action_view/railtie'

Bundler.require(*Rails.groups)

module RalixTodomvc
  class Application < Rails::Application
    config.load_defaults 6.0
  end
end
