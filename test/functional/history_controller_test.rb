require 'test_helper'

class HistoryControllerTest < ActionController::TestCase
  test "should get get" do
    get :get
    assert_response :success
  end

end
