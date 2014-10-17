$(document).ready(function() {

    var url = "http://localhost:5000/api/v1/monitors/?small";
    // if (username != undefined) {
    //     url = "http://localhost:5000/api/v1/monitors/" + username + "?small";
    // }

    $.get(url, function(data) {
        response = JSON.parse(data);
        keys = Object.keys(response);

        $("#checks").html("");
        keys.forEach(function(entry) {
            $("#checks").append(
                "<div style=\"width:100%; height:50px; float:left;\"><h2>" + entry + "</h2></div>");
            for (var i = 0; i < response[entry].values.length; i++) {
                $("#checks").append(
                    "<div style=\"width:200px; height:120px; float:left; font-size:10px; margin-bottom: 20px;\">\n" +
                    "    <div style=\"height:100px; width:100px; margin: 0 50px 0 50px; \"><canvas height=\"100\" width=\"100\" id=\"status-" + response[entry].values[i].id + "\" style=\"float:left; width:100px; height:100px;\"></canvas></div>\n" +
                    "    <div style=\"width:200px; height:20px; float:left;\"><center>" + response[entry].values[i].server_name + /* "<br>" + response[entry].values[i].hostname + */ "</center></div>\n" +
                    "</div>");
                statusCircle("status-" + response[entry].values[i].id, response[entry].values[i].status);
            }
        });
    });
});


function statusCircle(id, status) {
    if (status.good == undefined) {
        status.good = 0;
    }
    if (status.warning == undefined) {
        status.warning = 0;
    }
    if (status.bad == undefined) {
        status.bad = 0;
    }

    window.addEventListener("resize", function(){ drawCircle(id, status); }, false);
    drawCircle(id, status);
}

function drawCircle(id, status) {
    var canvas = document.getElementById(id);
    canvas.width = canvas.parentElement.offsetWidth
    canvas.height = canvas.parentElement.offsetHeight


    if (canvas.getContext) {
        cuts = status.good + status.warning + status.bad;

        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var x = canvas.width/2;
        var y = canvas.height/2;
        var radius = (x > y ? y : x)-1;
        var startAngle = 0;
        var endAngle = Math.PI*2;
        var antiClockwise = false;

        ctx.beginPath();
        ctx.arc(x, y, radius+1, 0, Math.PI*2, antiClockwise);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fillStyle = '#000'; // '#ff0';
        ctx.fill();

        var colorings = {good: 0, warning: 0, bad: 0};

        for (var i = 0; i < cuts; i++) {
            startAngle = 0 + (((Math.PI*2)/cuts)*(i-1));
            endAngle = ((Math.PI*2)/cuts)*i;

            var color = "#ff311b";
            if (status.good > colorings.good) {
                colorings.good++;
                color = "#03dc18";
            } else if (status.warning > colorings.warning) {
                colorings.warning++;
                color = "#f8ff33";
            }

            ctx.beginPath();
            ctx.arc(x, y, radius, startAngle, endAngle, antiClockwise);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, radius-(radius/5), 0, Math.PI*2, antiClockwise);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fillStyle = '#fff'; // '#ff0';
        ctx.fill();

        var fontHeight = (radius*0.55)
        ctx.font = 'bold ' + fontHeight + 'px Arial';
        ctx.fillStyle = '#000';
        var txt = cuts + '/' + cuts;
        ctx.fillText(txt, x-ctx.measureText(txt).width/2, y+(fontHeight/3.0));
    }
}
