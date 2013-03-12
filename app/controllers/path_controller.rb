class PathController < ApplicationController
  before_filter :check
  def check
    if not session[:email]
      cookies[:mycallback] = "http://#{request.host}:#{request.port}#{request.fullpath}"
      redirect_to '/auth/google' 
      return 
    end
    if not /[brdf]([0-9]{8})/ =~ session[:email]
      render :text => session[:email] + " is invalid"
    end
    @email = session[:email]
  end

  def git
    render :text => "You're: " + @email + "<br/>You submitted \"" + params[:path] + "\""
  end
end
