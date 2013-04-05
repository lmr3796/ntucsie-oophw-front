class AdminController < ApplicationController
  before_filter :validate

  def validate
    if not session[:email]
      cookies[:mycallback] = "#{request.protocol}#{request.host_with_port}#{request.fullpath}"
      redirect_to '/auth/google_oauth2'
    end

    @email = session[:email]

    if not @admins.include? @email
      redirect_to '/'
    end
  end

  def index
    @dest = homework_dest_for(@homework_number)
  end
end
