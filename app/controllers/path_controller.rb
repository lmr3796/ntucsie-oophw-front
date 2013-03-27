class PathController < ApplicationController
  def git
    @repo = params[:path]
    #render :text => "You're: " + @id + "<br/>You submitted \"" + @repo + "\""
    dest = "/tmp2/oophw/#{@id}"
    @msg = `mkdir -p #{dest}`
    if not $?.success?
        render :text => "Hi #{@id}, mkdir has failed, message is:<br/>#{@msg}", :status => 500
        return
    end
    @msg = `(cd #{dest} && git clone #{@repo} 2>&1 > /dev/null)`
    if not $?.success?
        render :text => "Hi #{@id}, git clone failed", :status => 400
        return
    end
    @commit = `(cd #{dest}/#{@repo.gsub(/\.git$/, "")[/\/.*$/][1..-1]} && git log -1)`
    if not $?.success?
        render :text => "Hi #{@id}, error fetching git repository info", :status => 500
        return
    end
    render :text => "Hi #{@id}, git clone succeeded.<br/>"+
                    "Latest commit:"+
                    "<pre>#{@commit.gsub("<", "&lt;").gsub(">", "&gt;")}</pre>"
  end
end
