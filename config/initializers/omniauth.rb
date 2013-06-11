Rails.application.config.middleware.use OmniAuth::Builder do
  omniauth_config_file = File.join(Rails.root, 'config', 'omniauth.yml')
  raise "#{omniauth_config_file} is missing!" unless File.exists? omniauth_config_file
  OmniAuth.config.full_host = YAML.load_file(omniauth_config_file)[Rails.env].symbolize_keys[:hostname]
	provider :google_oauth2, '723504240573.apps.googleusercontent.com', '01uXTsiIRAWJPrAqqkStWa3j', { :scope => 'userinfo.email,userinfo.profile' }
end

