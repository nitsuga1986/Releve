require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Releve
  class Application < Rails::Application
	# Enable the asset pipeline
	config.assets.enabled = true
	config.assets.precompile += %w[*.png *.jpg *.jpeg *.gif] 
	config.assets.precompile += %w( 
		jquery-ui/datepicker.js 
		jquery-ui/autocomplete.js 
		angular/angular.min.js 
		angular/angular-resource.min.js
		angular/angular-route.min.js
		angular/ng-table.min.js
		routes.js
		config.js
		services/resources.js
		controllers/ClaseEditCtrl.js
		controllers/ClaseIndexCtrl.js
		controllers/ClaseShowCtrl.js
		controllers/ClaseJoinCtrl.js
		filters/html_trusted.js
	)
	config.assets.precompile += %w(
	  ie.js
	  ie.css
	)
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    config.i18n.enforce_available_locales = true
    config.i18n.default_locale = :en
  end
end
