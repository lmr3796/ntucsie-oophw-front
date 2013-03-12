class SessionsController < ApplicationController
  def new
  end

  def create
    auth_hash = request.env['omniauth.auth']
    session[:email] = auth_hash[:info][:email]
    if cookies[:mycallback]
      redirect_to cookies[:mycallback]
      cookies[:mycallback] = nil
    else
      redirect_to :root
    end
  end

  def failure
  end

  def destroy
    session[:user_id] = nil
    redirect_to :root
  end
end
