$(document).ready(function() {

    var url = "http://localhost:5000/api/v1/monitors/?small";
    // if (username != undefined) {
    //     url = "http://localhost:5000/api/v1/monitors/" + username + "?small";
    // }

    $.get(url, function(data) {
        response = JSON.parse(data);
        keys = Object.keys(response);

        keys.forEach(function(entry) {
            $("#dashboard-panel").append(
                '<div class="row">' +
                '    <h2>' +
                '        ' + entry +
                '    </h2>' +
                '</div>' +
                '<div class="row" id="user-' + entry + '">' +
                '</div>');

            for (var i = 0; i < response[entry].values.length; i++) {
                $("#user-" + entry).append('<div class="col-lg-2"><div id="status-' + response[entry].values[i].id + '"></div></div>');

                Morris.Donut({
                    element: "status-" + response[entry].values[i].id,
                    data: [{
                        label: "OK",
                        value: response[entry].values[i].status.good
                    }, {
                        label: "WARNING",
                        value: response[entry].values[i].status.warning
                    }, {
                        label: "CRITICAL",
                        value: response[entry].values[i].status.bad
                    }],
                    resize: true,
                    colors: [
                        '#03dc18',
                        '#f8ff33',
                        '#ff311b'
                    ]
                });
            }
        });
    });
});
