require 'open-uri'
require 'json'
class HistoryController < ApplicationController
  def get
    @email = session[:email] # Use OAuth to get email and ID
    @student_id = @email[0...@email.index('@')] 
    @hw_id = params[:hw_id]

    if not /@csie\.ntu\.edu\.tw/ =~ session[:email]
      render :status => 403
      return
    end

    uri = "#{GIT_SERVER}/history/#{@hw_id}/#{@student_id}"
    result = open(uri).read
    render :json => JSON.parse(result)
    return
  end
end
