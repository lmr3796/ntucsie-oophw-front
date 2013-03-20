class PathController < ApplicationController
  before_filter :check
  def check
    if not session[:email]
      cookies[:mycallback] = "https://#{request.host}#{request.fullpath}"
      redirect_to '/auth/google_oauth2' 
      return 
    end
    if not /@csie\.ntu\.edu\.tw/ =~ session[:email]
      render :text => session[:email] + " is invalid"
    end
    @email = session[:email]
    @id = @email[0...@email.index('@')]
  end

  def git
    @path = params[:path]
    #render :text => "You're: " + @id + "<br/>You submitted \"" + @path + "\""
    dest = "/tmp2/r01944027/#{@id}"
    msg = `mkdir -p #{dest}`
    if not $?.success?
        render :text => "You're #{@id}, mkdir has failed, message is:<br/>#{msg}"
        return
    end
    msg = `(cd #{dest}; git clone #{@path})`
    if not $?.success?
        render :text => "You're #{@id}, git clone failed, message is:<br/>#{msg}"
        return
    end
    render :text => "You're #{@id}<br/>git clone succeed<br/>Go to #{request.host}:#{dest} and have a look!"
  end
end
