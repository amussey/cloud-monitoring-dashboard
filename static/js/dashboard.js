$(document).ready(function() {
    refreshMonitors();
    window.setInterval(refreshMonitors, 60000);

    $("#search-bar").change(function() {
        console.debug("Changed!");
        filterMonitors($("#search-bar").val());
    });
});

function refreshMonitors() {
    var url = "/api/v1/monitors?small";
    if (username != undefined) {
        url = "/api/v1/monitors/" + username + "?small";
    }
    $.get(url, function(data) {
        response = JSON.parse(data);
        keys = Object.keys(response);

        $("#sonic-loader").remove();

        keys.forEach(function(user) {
            if ($('#user-' + user + '-header').length == 0) {
                if (username == undefined) {
                    $("#dashboard-panel").append(
                        '<div class="row" id="user-' + user + '-header">' +
                        '    <h2>' +
                        '        ' + user +
                        '    </h2>' +
                        '</div>');
                }
                $("#dashboard-panel").append('<div class="row" id="user-' + user + '"></div>');
            }
            renderMonitors(user, response[user]);
        });
    });
}

function renderMonitors(user, alarms) {
    var id = "#user-" + user;
    console.debug("Refreshing " + user + "'s servers...");
    $(id).empty();
    for (var i = 0; i < alarms.values.length; i++) {
        $(id).append(
            '<div class="col-lg-1 col-md-2 col-sm-3 col-xs-4 status-circle" server_name="' + user + ' ' + alarms.values[i].server_name + '">\n' +
            '    <a href="/' + user + '/' + alarms.values[i].id + '" title="' + alarms.values[i].server_name + '"><div style="width:100%;">\n' +
            '        <canvas id="status-' + alarms.values[i].id + '"></canvas>\n' +
            '    </div></a>\n' +
            '    <!-- <div class="text-right">\n' +
            '        <a href="#">' + alarms.values[i].server_name + ' <i class="fa fa-arrow-circle-right"></i></a>\n' +
            '    </div> -->\n' +
            '</div>');
        statusCircle("status-" + alarms.values[i].id, alarms.values[i].status, true);
    }
}

function filterMonitors(search) {
    console.debug(search);
    $( ".status-circle" ).each(function( index ) {
        console.log( $(this).attr("server_name") );
        var searchList = search.split(" ");
        for (var i = 0; i < searchList.length; i++) {
            if (!$(this).attr("server_name").contains(searchList[i])) {
                $(this).css("display", "none");
                break;
            }
            $(this).css("display", "inline");
        }
    });
}
