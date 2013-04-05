module ApplicationHelper
  def homework_dest_for(number, id=nil)
    if id == nil
      "/tmp2/oophw#{number}"
    end

    "/tmp2/oophw#{number}/#{id}"
  end

  def origin_for(repo)
    `cd #{repo.working_dir} && git config --get remote.origin.url`
  end
end
