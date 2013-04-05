require 'grit'

class WelcomeController < ApplicationController
  def index
    if session[:email]
      @email = session[:email]
      @id = @email[0...@email.index('@')]

      @submissions = []

      dest = homework_dest_for(@homework_number, @id)
      FileUtils.mkdir_p dest unless File.directory?(dest)
      Dir.foreach(dest) do |f|
        n = f.to_i
        if n.to_s == f
          repo_dir = File.join(dest, f)
          repo = Grit::Repo.new(repo_dir) rescue NoSuchPathError
          @submissions.push({
            :version    => n,
            :repo       => `cd #{repo_dir} && git remote show -n origin | awk 'NR==2 {print $NF}'`,
            :info       => repo.commits.first,
            :time       => File::Stat.new(repo_dir).ctime
          })
        end
      end

      @submissions.sort! { |x,y| y[:version] <=> x[:version] }
    end
  end
end
