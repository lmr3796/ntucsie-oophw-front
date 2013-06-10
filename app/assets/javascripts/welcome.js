// Use ajax to refresh table
function reload_history(hw_id) {
    console.log("Reload");
    $("#homework_id_hint").text("homework hw_id");
    $.ajax({
        url: "history/" + hw_id,
    }).done(function(res) {
        $("#history_table").find("#history_entries").find("tr").remove();
        if(res['submissions'] == null || res['submissions'].length == 0){
            // Hide the history table
            $("#history_unavailable").show();
            $("#history_table").hide();
        } else {
            // Show the history table
            $("#history_unavailable").hide();
            $("#history_table").show();

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
                        entry += "empty"
                    }
                    entry += "</td>";
                    entry += "<td>" + submission['time'] + "</td>";
                    return entry;
                };
                console.log(submission);
                $("#history_entries").append(generate_entry(submission));
            });
        }
    }).fail(function() {
        console.log("No history get");
    });
};
$(document).ready(function() {
    $('#add-account-lightbox').lightbox({ show: false });
    $('#switch-account-lightbox').lightbox({ show: false });
    $('#dialog-loading').modal({ backdrop: 'static', show: false });
    $('#dialog-success').modal({ show: false }).on('hidden', function() {window.location = window.location;});
    $('#dialog-failed').modal({ show: false }).on('hidden', function() {window.location = window.location;});
    $('#git-submit')
    .change(function() {
        reload_history($('#hw_id').val());
    })
.submit(function() {
    $('#dialog-loading').modal('show');
    $.ajax({
        url: $(this).attr('action'),
        data: $(this).serialize()
    }).done(function(res) {
        $('#dialog-loading').modal('hide');
        $('#git-submit :input:text').val('');

        var $dialog = $('#dialog-success');
        $('.dialog-message', $dialog).text(res.message);
        $('.dialog-version', $dialog).text(res.version);
        $('.dialog-git-repo', $dialog).text(res.repo);
        $('.dialog-commit-details', $dialog).text(
            'Commit: ' + res.info.id + '\n' +
            'Author: ' + res.info.author.name + ' <' + res.info.author.email + '>\n' +
            'Date: ' + res.info.authored_date
            );
        $dialog.modal('show');
    }).fail(function(jqxhr, textStatus, errorThrown) {
        $('#dialog-loading').modal('hide');

        var $dialog = $('#dialog-failed');
        var res = JSON.parse(jqxhr.responseText);
        $('.dialog-message', $dialog).text(res.message);
        $('.dialog-error', $dialog).text(res.error);
        $dialog.modal('show');
    });
    return false;
});
// TODO: animation?
reload_history($('#hw_id').val());
});

