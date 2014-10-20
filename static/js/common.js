$(document).ready(function() {
    $.get("/api/v1/accounts", function(data) {
        $(document).trigger("accounts-ready", data);
    });
});

$(document).on("accounts-ready", function(e, data) {
    $("#users-dropdown").click();
    data = JSON.parse(data);
    for (var i = 0; i < data.length; i++) {
        $("#nav-accounts-dropdown").append(
            '<li>\n' +
            '    <a href="/' + data[i].username + '">\n' +
            '        ' + (data[i].alias != undefined ? data[i].alias : data[i].username) + '\n' +
            '    </a>\n' +
            '</li>\n');
    }
});
