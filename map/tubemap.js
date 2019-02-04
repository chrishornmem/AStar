function TubeMap(cols, rows, x, y, w, h, allowDiagonals, wallRatio) {
    // How many columns and rows?
    this.cols = cols;
    this.rows = rows;

    // This will the 2D array
    this.grid = [];
    this.path = [];
    this.map = [];

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    var line1End = Math.round(cols / 2);
    var line2End = Math.round(rows / 2);

    //console.log(line1End);
    //console.log(line2End);

    var stations = [
        { name: "Paddington", x: 5, y: 10 },   // 0
        { name: "Liverpool St", x: 25, y: 10 },  // 1
        { name: "Temple", x: 10, y: 5 },  // 2
        { name: "Embankment", x: 10, y: 25 }, // 3
        { name: "Westminster", x: 3, y: 25 }, // 4
        { name: "Charing Cross", x: 25, y: 25 }, // 5
        { name: "St James Park", x: 25, y: 47 }, // 6
        { name: "Holborn", x: 35, y: 10 }, // 7
        { name: "Waterloo", x: 35, y: 47 }, // 8
        { name: "Bank", x: 25, y: 15 }, // 9
        { name: "Green Park", x: 46, y: 15 } // 10
    ]

    var points = [
        { from: 0, to: 1 },
        { from: 2, to: 3 },
        { from: 4, to: 5 },
        { from: 5, to: 6 },
        { from: 6, to: 8 },
        { from: 7, to: 8 },
        { from: 9, to: 10 }
    ];

    //console.log("points:");
    //console.log(points);

    // Making a 2D array
    for (var i = 0; i < cols; i++) {
        this.grid[i] = [];
        this.map[i] = [];
    }

    for (var i = 0; i < points.length; i++) {
        var fromStation = points[i].from;
        var toStation = points[i].to;

        if (stations[fromStation].y == stations[toStation].y) {
            for (var j = stations[fromStation].x; j <= stations[toStation].x; j++) {
                var r = stations[fromStation].y
                this.map[j][r] = true;
            }
        } else if (stations[fromStation].x == stations[toStation].x) {
            for (var j = stations[fromStation].y; j <= stations[toStation].y; j++) {
                var c = stations[fromStation].x
                this.map[c][j] = true;
            }
        }
    }

    var isWall;
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (!this.map[i][j]) {
                isWall = true;
            } else {
                isWall = false;
            }
            this.grid[i][j] = new Spot(i, j, x + i * w / cols, y + j * h / rows, w / cols, h / rows, isWall, this.grid);
        }
    }

    this.start = this.grid[10][5];
    //this.end = this.grid[cols-1][rows-1];
    this.end = this.grid[35][10];

}
