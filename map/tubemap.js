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

    var points = [
        { from: [0, 0], to: [0, line1End] },
        { from: [0,line1End], to: [line2End, line1End] },
        { from: [line2End, line1End], to: [line2End, rows-1] },
        { from: [line2End, rows-1], to: [cols-1, rows-1] }
    ];

    console.log("points:");
    console.log(points);

    // Making a 2D array
    for (var i = 0; i < cols; i++) {
        this.grid[i] = [];
        this.map[i] = [];
    }

    for (var i = 0; i < points.length; i++) {
        if (points[i].from[1] == points[i].to[1]) {
            for (var j = points[i].from[0]; j <= points[i].to[0]; j++) {
                var r = points[i].from[1]
                this.map[j][r] = true;
            }
        } else if (points[i].from[0] == points[i].to[0]) {
            for (var j = points[i].from[1]; j <= points[i].to[1]; j++) {
                var c = points[i].from[0]
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
}
