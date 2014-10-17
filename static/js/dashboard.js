$(document).ready(function() {

    var url = "http://localhost:5000/api/v1/monitors/?small";
    if (username != undefined) {
        url = "http://localhost:5000/api/v1/monitors/" + username + "?small";
    }

    $.get(url, function(data) {
        response = JSON.parse(data);
        keys = Object.keys(response);

        keys.forEach(function(entry) {
            if (username == undefined) {
                $("#dashboard-panel").append(
                    '<div class="row">' +
                    '    <h2>' +
                    '        ' + entry +
                    '    </h2>' +
                    '</div>');
            }

            for (var i = 0; i < response[entry].values.length; i++) {
                if (i % 6 == 0) {
                    $("#dashboard-panel").append('<div class="row" id="user-' + entry + '-' + parseInt(i / 6) + '"></div>');
                }

                $("#user-" + entry + '-' + parseInt(i / 6)).append(
                    '<div class="col-lg-2 col-md-2 col-sm-3 col-xs-4">\n' +
                    '    <canvas id="status-' + response[entry].values[i].id + '"></canvas>\n' +
                    '    <div class="text-right">\n' +
                    '        <a href="#">' + response[entry].values[i].server_name + ' <i class="fa fa-arrow-circle-right"></i></a>\n' +
                    '    </div>\n' +
                    '</div>');
                statusCircle("status-" + response[entry].values[i].id, response[entry].values[i].status);
            }
        });
    });
});
