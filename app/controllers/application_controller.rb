class ApplicationController < ActionController::Base
  before_filter :set_homework_number
  protect_from_forgery

  def set_homework_number
    @homework_number = 3
  end
end
