require 'grit'

class WelcomeController < ApplicationController
  def index
    if session[:email]
      @email = session[:email]
      @id = @email[0...@email.index('@')]
      @submissions = []

      # Create directory only on valid IDs
      return if not /@csie\.ntu\.edu\.tw/ =~ session[:email]
    end
  end
end
