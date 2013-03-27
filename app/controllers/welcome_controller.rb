class WelcomeController < ApplicationController
  before_filter :check
  def check
    if not session[:email]
      cookies[:mycallback] = "#{request.protocol}#{request.host_with_port}#{request.fullpath}"
      redirect_to '/auth/google_oauth2' 
      return 
    end
    if not /@csie\.ntu\.edu\.tw/ =~ session[:email]
      render :text => session[:email] + " is invalid"
    end
    @email = session[:email]
    @id = @email[0...@email.index('@')]
  end

  def index
    if session[:email]
      @email = session[:email]
      @id = @email[0...@email.index('@')]
    end
  end
end
