$(document).ready(function() {
    $.get("/api/v1/filters", function(data) {
        $(document).trigger("filters-ready", data);
    });

    if (parent.location.rehash['filter'] != undefined) {
        $("#search-bar").val(parent.location.rehash['filter']);
    }
    parent.addEventListener('rehash', function (e) {
        if (parent.location.rehash['filter'] != undefined) {
            $("#search-bar").val(parent.location.rehash['filter']);
            filterMonitors($("#search-bar").val());
        }
    }, false);

    refreshMonitors();
    window.setInterval(refreshMonitors, 20000);


    $("#search-bar").change(function() {
        if (DEBUG) {
            console.debug("Changed!");
        }
        filterMonitors($("#search-bar").val());
    });


    $("#filter-save-btn").on("click", function(e) {
        $("#search-bar").prop("disabled", true);

        $.post( "/api/v1/filters", { filter: $("#search-bar").val() }, function(data) {
            // Re-enable the buttons
            $("#search-bar").prop("disabled", false);

            $.get("/api/v1/filters", function(data) {
                $(document).trigger("filters-ready", data);
            })

        });
    });


    $("#filter-clear-btn").on("click", function(e) {
        $("#search-bar").val("");
        filterMonitors($("#search-bar").val());
    });
});


$(document).on("filters-ready", function(e, data) {
    if ($("#filters-dropdown").prop("open") == undefined || !$("#filters-dropdown").prop("open")) {
        $("#filters-dropdown").prop("open", true);
        $("#filters-dropdown").click();
    }

    data = JSON.parse(data);
    if (data.response == "success") {
        data = data.data;
        $("#nav-filters-dropdown").html("");
        for (var i = 0; i < data.length; i++) {
            $("#nav-filters-dropdown").append(
                '<li>\n' +
                '    <a href="#filter=' + encodeURI(data[i]) + '">\n' +
                '        ' + data[i] + '\n' +
                '    </a>\n' +
                '</li>\n');
        }
    }
});


function refreshMonitors() {
    var url_params = "?small&fast"
    var url = "/api/v1/monitors" + url_params;
    if (username != undefined) {
        url = "/api/v1/monitors/" + username + url_params;
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
        filterMonitors($("#search-bar").val());
    });
}


function renderMonitors(user, alarms) {
    var id = "#user-" + user;
    if (DEBUG) {
        console.debug("Refreshing " + user + "'s servers...");
    }
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
    if (DEBUG) {
        console.debug("Filtering for: " + search);
    }

    search = search.trim();
    if (search == "") {
        $( ".status-circle" ).each(function( index ) {
            $(this).show();
        });
    } else {
        $( ".status-circle" ).each(function( index ) {
            $(this).hide();
        });

        $( ".status-circle" ).each(function( index ) {
            var searchList = search.split(" ");
            for (var i = 0; i < searchList.length; i++) {
                if ($(this).attr("server_name").contains(searchList[i])) {
                    $(this).show();
                }
            }
        });
    }
    $(window).trigger('resize');
}
