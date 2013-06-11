// Use ajax to refresh table
function reload_history() {
    var hw_id = $('#hw_id').val();
    // TODO: animation?
    $.ajax({
        url: "history/" + hw_id,
    }).done(function(res) {
        $("#history-table").find("#history-entries").find("tr").remove();
        if(res['submissions'] == null || res['submissions'].length == 0){
            // Hide the history table
            $("#history-unavailable").show();
            $("#history-table").hide();
        } else {
            // Show the history table
            $("#history-unavailable").hide();
            $("#history-table").show();

            // Generate the table entries
            $.each(res['submissions'], function(i, submission){
                // TODO: evaluate the submission history table
                var generate_entry = function(submission){
                    var entry = "<tr>";
                    entry += "<td>" + submission['version'] + "</td>";
                    entry += "<td>" + submission['repo'] + "</td>";
                    entry += "<td>";
                    // TODO: if @repo fails, which indicates cloning?
                    if (submission['info']){
                        entry += submission['info']['id']
                    }else{
                        entry += "Empty repository"
                    }
                    entry += "</td>";
                    entry += "<td>" + submission['time'] + "</td>";
                    return entry;
                };
                $("#history-entries").append(generate_entry(submission));
            });
        }
    }).fail(function() {
        console.log("No history get");
    });
};

function set_clone_message(res){
    $('#git-submit :input:text').val('');

    $('#dialog-message').text(res.message);
    $('#submit-version').text(res.version);
    $('#git-repo').text(res.repo);
    var commit_detail;
    commit_detail = (res.info != null) ? (
            'Commit: ' + res.info.id + '\n' +
            'Author: ' + res.info.author.name + ' <' + res.info.author.email + '>\n' +
            'Date: ' + res.info.authored_date
            ):"Empty repository";
    $('#commit-details').text(commit_detail);
};
$(document).ready(function() {
    $('#add-account-lightbox').lightbox({ show: false });
    $('#switch-account-lightbox').lightbox({ show: false });
    $('#dialog-loading').modal({ backdrop: 'static', show: false });
    $('#dialog-success').modal({ show: false }).on('hidden', function() {reload_history()});
    $('#dialog-failed').modal({ show: false }).on('hidden', function() {reload_history()});
    $('#git-submit')
    .change(function() {reload_history();})
    .submit(function() {
        submit_success = true;
        $('#dialog-loading').modal('show');
        $("#loading-message").text("Cloning...");

        // git clone
        $.ajax({
            url: $(this).attr('action'),
            data: $(this).serialize()
        }).done(function(clone_res) {
            $("#loading-message").text("Building...");
            set_clone_message(clone_res);
            // Build after successfully cloned
            $.ajax({
                url: "build/hw5",
                data: { "version": clone_res.version }
            }).done(function(build_res) {
                $('#build-details').text("Success.").addClass('text-info').removeClass('text-error');;
            }).error(function(jqxhr, textStatus, errorThrown) {
                var res = JSON.parse(jqxhr.responseText);
                $('#build-details').text(res.message).addClass('text-error').removeClass('text-info');
            }).complete(function(build_res){
                $('#dialog-loading').modal('hide');
                $("#dialog-success").modal('show');
            });
        }).error(function(jqxhr, textStatus, errorThrown) {
            var res = JSON.parse(jqxhr.responseText);
            $('#fail-message').text(res.message);
            $('#fail-error').text(res.error);
            $('#dialog-loading').modal('hide');
            $("#dialog-failed").modal('show');
        });
        return false;   // Ajax used so return false to cancel the normal full submit request of form
    });
reload_history();
});

