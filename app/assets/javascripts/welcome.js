// Use ajax to refresh table
function reload_history(hw_id) {
    console.log("Reload");
    $.ajax({
        url: "history/" + hw_id,
    }).done(function(res) {
        console.log(res);

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

