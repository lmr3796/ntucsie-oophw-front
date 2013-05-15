module AdminHelper
  def get_repo_url(repo)
    matched = /:(?<target>[^\.]+)\.git/.match(repo)
    if matched != nil
      "http://bitbucket.org/#{matched[:target]}".downcase
    else
      '#'
    end
  end
end
