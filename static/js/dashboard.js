$(document).ready(function() {
    $.get("http://localhost:5000/api/v1/monitors/?small", function(data) {
        // console.debug(data);
        response = JSON.parse(data);
        keys = Object.keys(response);

        keys.forEach(function(entry) {
            $("#checks").html("");
            for (var i = 0; i < response[entry].values.length; i++) {
                // console.debug(response[entry].values[i].server_name);
                $("#checks").append(
                    "<div style=\"width:500px; height:100px; border: solid 1px #000; float:left;\">\n" +
                    "    <canvas height=\"100\" width=\"100\" id=\"status-" +
                    response[entry].values[i].id +
                    "\"></canvas>\n" +
                    response[entry].values[i].server_name +
                    "</div>\n");
                drawCircle("status-" + response[entry].values[i].id, response[entry].values[i].alarms.length, response[entry].values[i].status);
            }
        });
    });
});


function drawCircle(id, alerts, status) {
    var canvas = document.getElementById(id);
    if (canvas.getContext) {

        var ctx = canvas.getContext("2d"); 
        var x = canvas.width/2;
        var y = canvas.height/2;
        var radius = (canvas.width > canvas.height ? canvas.height/2 : canvas.width/2);
        var startAngle = 0;
        var endAngle = Math.PI*2;
        var antiClockwise = false;

        var passing_tests = status['good'];

        for (var i = 0; i < alerts; i++) {
            startAngle = 0 + (((Math.PI*2)/alerts)*(i-1));
            endAngle = ((Math.PI*2)/alerts)*i;
            
            var color = "#" +
                Math.floor((Math.random() * 15) + 1).toString(16) +
                Math.floor((Math.random() * 15) + 1).toString(16) +
                Math.floor((Math.random() * 15) + 1).toString(16);

            ctx.beginPath();
            ctx.arc(x, y, radius, startAngle, endAngle, antiClockwise);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.fillStyle = getStatusColor(status); //color; // '#ff0';
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, radius-(radius/5), 0, Math.PI*2, antiClockwise);
        ctx.lineTo(75, 75);
        ctx.closePath();
        ctx.fillStyle = '#fff'; // '#ff0';
        ctx.fill();

        var fontHeight = (radius*0.55)
        ctx.font = 'bold ' + fontHeight + 'px Arial';
        ctx.fillStyle = '#000';
        var txt = passing_tests + '/' + alerts;
        ctx.fillText(txt, x-ctx.measureText(txt).width/2, y+(fontHeight/3.0));
    }
}

function getStatusColor(status) {
    if (status.good > 0) {
        status.good--;
        return "#03dc18"; //#00c212";
    } else if (status.warning > 0) {
        status.warning--;
        return "#f8ff33";
    }
    return "#ff311b"; //#de1c07";
}
