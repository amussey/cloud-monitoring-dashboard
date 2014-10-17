
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
        var txt = status.good + '/' + cuts;
        ctx.fillText(txt, x-ctx.measureText(txt).width/2, y+(fontHeight/3.0));
    }
}
