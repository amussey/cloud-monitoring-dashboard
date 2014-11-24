var loader = {
    width: 300,
    height: 300,

    stepsPerFrame: 1,
    trailLength: 1,
    pointDistance: .05,

    strokeColor: '#03DC18',

    fps: 30,

    setup: function() {
        this._.lineWidth = 4;
    },
    step: function(point, index) {

        var cx = this.padding + 150,
            cy = this.padding + 150,
            _ = this._,
            angle = (Math.PI/180) * (point.progress * 360),
            innerRadius = index === 1 ? 30 : 75;

        _.beginPath();
        _.moveTo(point.x, point.y);
        _.lineTo(
            (Math.cos(angle) * innerRadius) + cx,
            (Math.sin(angle) * innerRadius) + cy
        );
        _.closePath();
        _.stroke();

    },
    path: [
        ['arc', 150, 150, 120, 0, 360]
    ]
};

var d, a, container = document.getElementById('sonic-loader');

d = document.createElement('div');
d.className = 'l';

a = new Sonic(loader);

d.appendChild(a.canvas);
container.appendChild(d);

a.play();
