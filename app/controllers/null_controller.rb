class NullController < ApplicationController
  def null
    render :nothing => true
  end
end
