class TestController < ApplicationController
  def test
    key_file = "#{Rails.root}/config/id_rsa"
    s = `ssh -o StrictHostKeyChecking=no -i #{key_file} oophw@localhost ls`
    render :text => s 
  end
end
