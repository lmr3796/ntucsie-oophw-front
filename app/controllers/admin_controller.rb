require 'grit'

class AdminController < ApplicationController
  include AdminHelper

  before_filter :validate

  def validate
    if not session[:email]
      cookies[:mycallback] = "#{request.protocol}#{request.host_with_port}#{request.fullpath}"
      redirect_to '/auth/google_oauth2'
    else
      @email = session[:email]
      @id = @email[0...@email.index('@')]

      if not @admins.include? @email
        redirect_to '/'
      end
    end
  end

  def index
    @students = []

    root = homework_dest_for(@homework_number)
    Dir.foreach(root) do |id|
      if id.start_with? '.'
        next
      end

      submissions = []

      dest = File.join(root, id)
      Dir.foreach(dest) do |f|
        n = f.to_i
        if n.to_s != f
          next
        end

        repo_dir = File.join(dest, f)
        repo = Grit::Repo.new(repo_dir) rescue NoSuchPathError
        submissions.push({
          :version  => n,
          :repo     => origin_for(repo),
          :info     => repo.commits.first,
          :time     => File::Stat.new(repo_dir).ctime
        })
      end

      if submissions.length == 0
        next
      end

      submissions.sort! { |x,y| y[:version] <=> x[:version] }
      @students.push({
        :id           => id,
        :submissions  => submissions
      })

      @students.sort! { |x,y| x[:id] <=> y[:id] }
    end
  end
end
