Rails.application.config.middleware.use OmniAuth::Builder do
	OmniAuth.config.full_host = 'https://oophw.csie.org'
	provider :google_oauth2, '723504240573.apps.googleusercontent.com', '01uXTsiIRAWJPrAqqkStWa3j', { :scope => 'userinfo.email,userinfo.profile' }
end

