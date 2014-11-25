$.ajax({
    type: "GET",
    url: "/api/v1/monitors/" + username + "/" + server_id,
}).done(function( data ) {
    data = JSON.parse(data);
    if (data.response != "success") {
        window.location.href = "/" + username;
    }

    data = data.data;
    $("#server-name").html(data.entity.label)
    for (var i = 0; i < data.alarms.length; i++) {
        appendAlarm(
            data.alarms[i].alarm.id,
            data.alarms[i].state,
            data.alarms[i].alarm.label,
            data.alarms[i].status);
    }
}).fail(function() {
    window.location.href = "/" + username;
});


function appendAlarm(id, state, label, status) {
    $('#current-alarms tr:last').after(
        '<tr id="alarm-' + id + '">' +
        '    <td class="alarm-state alarm-state-' + state + '">' + state + '</td>' +
        '    <td class="alarm-label">' + label + '</td>' +
        '    <td class="alarm-status">' + status + '</td>' +
        '</tr>');
}
