class TestController < ApplicationController
  def test
    s = `ssh -i /home/lmr3796/.ssh/id_rsa r01944027@linux9.csie.org ls`
    render :text => s
  end
end
