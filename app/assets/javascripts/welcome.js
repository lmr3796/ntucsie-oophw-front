// Use ajax to refresh table
function reload_history(no_animation) {
    if (!no_animation){  // To fix that loading animation shouldn't run on the first load
        // Add spin animation
        var opt = {
            lines: 13, // The number of lines to draw
            length: 20, // The length of each line
            width: 5, // The line thickness
            radius: 20, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#666', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        var spinner = new Spinner(opt).spin($("#history-loading-spinner-holder").get(0));
        $(".spinner").css("left", "50%").css("top", "95px")
            $("#history-loading").fadeIn();
    }

    // Reload
    var hw_id = $('#hw_id').val();
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
    }).complete(function() {
        $("#history-loading").fadeOut();
        $("#history-loading .spinner").remove();
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
    reload_history(true);
    $('#add-account-lightbox').lightbox({ show: false });
    $('#switch-account-lightbox').lightbox({ show: false });
    $('#dialog-loading').modal({ backdrop: 'static', show: false });
    $('#dialog-success').modal({ show: false }).on('hidden', function() {reload_history()});
    $('#dialog-failed').modal({ show: false }).on('hidden', function() {reload_history()});
    $('#hw_id').change(function() {reload_history();})
    $('#git-submit').submit(function() {
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
});

