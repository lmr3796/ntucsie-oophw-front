class ApplicationController < ActionController::Base
  include ApplicationHelper

  before_filter :set_variables
  protect_from_forgery

  def set_variables
    @homework_number = 3
    @admins = [
      'htlin@csie.ntu.edu.tw',
      'hsuantien@gmail.com',
      'r01922014@csie.ntu.edu.tw',
      'ptt2panda@gmail.com',
      'r01922059@csie.ntu.edu.tw',
      'celia781011@gmail.com',
      'r01944027@csie.ntu.edu.tw',
      'lmr3796@gmail.com',
    ]
  end
end
