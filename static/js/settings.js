$(document).ready(function() {
    $.get("/api/v1/filters", function(data) {
        data = JSON.parse(data);
        if (data.response == "success") {
            data = data.data;
            for (var i = 0; i < data.length; i++) {
                appendFilter(i, data[i]);
            }
        }

    });
});


$(document).on("accounts-ready", function(e, data) {
    // Load the accounts.
    data = JSON.parse(data);
    for (var i = 0; i < data.length; i++) {
        appendAccount(data[i].username, (data[i].alias != undefined ? data[i].alias : ''));
    }
});


function appendAccount(username, alias) {
    $('#current-accounts tr:last').after(
            '<tr id="user-' + username + '">' +
            '    <td><a href="#" onclick="javascript:removeAccount($(this));"><i class="fa fa-times remove-icon"></i></a></td>' +
            '    <td class="account-username">' + username + '</td>' +
            '    <td class="account-alias">' + alias + '</td>' +
            '</tr>');
}


$("#add-account").on("click", function(e) {
    $("#add-account").prop("disabled", true);
    $("#add-username").prop("disabled", true);
    $("#add-apikey").prop("disabled", true);
    $("#add-alias").prop("disabled", true);
    $("#add-account").html("Now adding account...");

    $.post( "/api/v1/accounts", { username: $("#add-username").val(), apikey: $("#add-apikey").val(), alias: $("#add-alias").val() }, function(data) {
        // Re-enable the buttons
        $("#add-account").prop("disabled", false);
        $("#add-username").prop("disabled", false);
        $("#add-apikey").prop("disabled", false);
        $("#add-alias").prop("disabled", false);

        appendAccount($("#add-username").val(), $("#add-alias").val());

        $("#add-username").val("");
        $("#add-apikey").val("");
        $("#add-alias").val("");
        $("#add-account").html("Add User");
    });
});


function removeAccount(current) {
    if (confirm("Are you sure you want to remove this user?")) {
        var row = current.parent().parent();
        var row_username = row.find(".account-username").html();
        $.ajax({
            type: "DELETE",
            url: "/api/v1/accounts",
            data: { username: row_username }
        }).done(function( html ) {
            $("#user-" + row_username).remove();
        });
    }
}


function appendFilter(number, filter) {
    $('#current-filters tr:last').after(
            '<tr id="filter-' + number + '">' +
            '    <td><a href="#" onclick="javascript:removeFilter($(this));"><i class="fa fa-times remove-icon"></i></a></td>' +
            '    <td class="filter-text">' + filter + '</td>' +
            '</tr>');
}


function removeFilter(filter) {
    var row = filter.parent().parent();
    var filter_text = row.find(".filter-text").text();
    $.ajax({
        type: "DELETE",
        url: "/api/v1/filters",
        data: { filter: filter_text }
    }).done(function( html ) {
        row.remove();
    });
}
