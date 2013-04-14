module AdminHelper
  def get_repo_url(repo)
    matched = /:(?<target>[^\.]+)\.git/.match(repo)
    if matched != nil
      "http://bitbucket.org/#{matched[:target]}"
    else
      '#'
    end
  end
end
