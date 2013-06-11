require 'grit'
require 'json'

class SubmitController < ApplicationController
  before_filter :check_email, :except => [:help]

  def check_email
    if not /@csie\.ntu\.edu\.tw/ =~ session[:email]
      render :json => { :message => 'Invalid account, please login with your NTU CSIE account.', :error => ''}, :status => 403
      return 
    end
  end

  def git
    @email = session[:email]
    @student_id = @email[0...@email.index('@')]
    @hw_id = params[:hw_id]
    @repo_url = params[:repo_url].strip

    uri = "#{GIT_SERVER}/submit/#{@hw_id}/#{@student_id}?url=#{@repo_url}"
    result = open(uri).read
    render :json => JSON.parse(result)
  end
end
