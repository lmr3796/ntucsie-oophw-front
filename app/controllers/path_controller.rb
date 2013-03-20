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
    @repo = params[:path]
    #render :text => "You're: " + @id + "<br/>You submitted \"" + @repo + "\""
    dest = "/tmp2/oophw/#{@id}"
    @msg = `mkdir -p #{dest}`
    if not $?.success?
        render :text => "You're #{@id}, mkdir has failed, message is:<br/>#{@msg}", :status => 500
        return
    end
    @commit = `(cd #{dest} && git clone #{@repo} 2>&1 > /dev/null&& cd #{@repo.gsub(/\.git$/, "")[/\/.*$/][1..-1]} && git log -1)`
    if not $?.success?
        render :text => "You're #{@id}, git clone failed", :status => 400
        return
    end
    render :text => "Hi #{@id}, git clone succeeded.<br/>"+
                    "Latest commit:"+
                    "<pre>#{@commit.gsub("<", "&lt;").gsub(">", "&gt;")}</pre>"
  end
end
