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
        url: "admin/history/" + hw_id,
    }).done(function(res) {
        $("#history-table").find("#history-entries").find("tr").remove();
        var students = res['students'];
        if(students == null || students.length == 0){
            // Hide the history table
            $("#history-unavailable").show();
            $("#history-table").hide();
        } else {
            // Show the history table
            $("#history-unavailable").hide();
            $("#history-table").show();

            // Generate the table entries
            $.each(students, function(i, student){
                var entry = $('<tr>')
                var latest = student['submissions'][0];
                entry.append($('<td>').text(student['id']));
                entry.append($('<td>').append($('<a>').attr('href', latest['repo']).text(latest['repo'])));
                entry.append($('<td>').text(latest['time']));
                entry.append($('<td>').text(student['submissions'].length));
                $("#history-entries").append(entry);
            });
        }
    }).fail(function() {
        console.log("No history get");
    }).complete(function() {
        $("#history-loading").fadeOut();
        $("#history-loading .spinner").remove();
    });
};

$(document).ready(function() {
    $('#hw_id').change(function() {reload_history();})
    reload_history(true);
});
