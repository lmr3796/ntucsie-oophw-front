require 'grit'

class WelcomeController < ApplicationController
  def index
    if session[:email]
      @email = session[:email]
      @id = @email[0...@email.index('@')]

      @submissions = []

      dest = "/tmp2/oophw#{@homework_number}/#{@id}"
      Dir.foreach(dest) do |f|
        n = f.to_i
        if n.to_s == f
          repo_dir = File.join(dest, f)
          repo_uri = 'git://github.com/telgniw/some-repo.git'
          repo = Grit::Repo.new(repo_dir) rescue NoSuchPathError
          head = repo.commits.first
          @submissions.push({
            :version    => n,
            :repo       => repo_uri,
            :info       => head
          })
        end
      end

      @submissions.sort! { |x,y| y[:version] <=> x[:version] }
    end
  end
end
