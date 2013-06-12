require 'grit'
require 'json'
require 'uri'
require 'net/https'

class BackendController < ApplicationController
  before_filter :check_email, :except => [:help]

  def check_email
    if not /@csie\.ntu\.edu\.tw/ =~ session[:email]
      render :json => { :message => 'Invalid account, please login with your NTU CSIE account.', :error => ''}, :status => 403
      return 
    end
    @email = session[:email] # Use OAuth to get email and ID
    @student_id = @email[0...@email.index('@')] 
    @hw_id = params[:hw_id]
  end

  def submit_git
    @repo_url = params[:repo_url].strip
    uri = "#{GIT_SERVER}/submit/#{@hw_id}/#{@student_id}?url=#{@repo_url}"
    puts uri
    invoke_backend(uri)
  end

  def check_clone
    uri = "#{GIT_SERVER}/status/clone/#{@student_id}/#{params[:job_id]}"
    invoke_backend(uri)
  end

  def history
    uri = "#{GIT_SERVER}/history/#{@hw_id}/#{@student_id}"
    invoke_backend(uri)
  end

  def build
    uri = "#{GIT_SERVER}/build/#{@hw_id}/#{@student_id}/#{params[:version]}"
    invoke_backend(uri)
  end

  def admin_history
    uri = "#{GIT_SERVER}/history/#{@hw_id}"
    invoke_backend(uri)
  end

  def invoke_backend(uri)
    uri = URI.parse uri
    http = Net::HTTP.new uri.host, uri.port
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    http.use_ssl = (uri.scheme == 'https')
    r = http.get(uri.request_uri)
    while r.code == "301"
      uri = URI.parse r.header['location']
      http = Net::HTTP.new uri.host, uri.port
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      http.use_ssl = (uri.scheme == 'https')
      r = http.get(uri.request_uri)
    end
    render :json => r.body, :status => r.code
  end
end
