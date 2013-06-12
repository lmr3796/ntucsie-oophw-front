require 'grit'

class AdminController < ApplicationController
  include AdminHelper

  before_filter :validate

  def validate
    if not session[:email]
      cookies[:mycallback] = "#{request.protocol}#{request.host_with_port}#{request.fullpath}"
      redirect_to '/auth/google_oauth2'
    else
      @email = session[:email]
      @id = @email[0...@email.index('@')]

      if not @admins.include? @email
        redirect_to '/'
      end
    end
  end

  def index
    
  end
end
