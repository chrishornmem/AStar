let drawLine = (x1, y1, x2, y2, map) => {

    //console.log(x1);
    //console.log(y1);
    //console.log(x2);
    //console.log(y2);
    //console.log(map);

    // Iterators, counters required by algorithm
    let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;
    // Calculate line deltas
    dx = x2 - x1;
    dy = y2 - y1;
    // Create a positive copy of deltas (makes iterating easier)
    dx1 = Math.abs(dx);
    dy1 = Math.abs(dy);
    // Calculate error intervals for both axis
    px = 2 * dy1 - dx1;
    py = 2 * dx1 - dy1;
    // The line is X-axis dominant
    if (dy1 <= dx1) {
        // Line is drawn left to right
        if (dx >= 0) {
            x = x1; y = y1; xe = x2;
        } else { // Line is drawn right to left (swap ends)
            x = x2; y = y2; xe = x1;
        }
        //pixel(x, y); // Draw first pixel
        //console.log(x + ',' + y);

        map[y][x] = true;
        // Rasterize the line
        for (i = 0; x < xe; i++) {
            x = x + 1;
            // Deal with octants...
            if (px < 0) {
                px = px + 2 * dy1;
            } else {
                if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
                    y = y + 1;
                } else {
                    y = y - 1;
                }
                px = px + 2 * (dy1 - dx1);
            }
            // Draw pixel from line span at
            // currently rasterized position
            //pixel(x, y);
            //console.log(x + ',' + y);

            map[y][x] = true;
       //     map[y+1][x] = true;
       //     map[y-1][x] = true;
        }
    } else { // The line is Y-axis dominant
        // Line is drawn bottom to top
        if (dy >= 0) {
            x = x1; y = y1; ye = y2;
        } else { // Line is drawn top to bottom
            x = x2; y = y2; ye = y1;
        }
        //pixel(x, y); // Draw first pixel
        // Rasterize the line
        //console.log(x + ',' + y);

        map[y][x] = true;
        for (i = 0; y < ye; i++) {
            y = y + 1;
            // Deal with octants...
            if (py <= 0) {
                py = py + 2 * dx1;
            } else {
                if ((dx < 0 && dy<0) || (dx > 0 && dy > 0)) {
                    x = x + 1;
                } else {
                    x = x - 1;
                }
                py = py + 2 * (dx1 - dy1);
            }
            // Draw pixel from line span at
            // currently rasterized position
            //pixel(x, y);
            // console.log(x + ',' + y);
            map[y][x] = true;
        //    map[y][x+1] = true;
        //    map[y][x-1] = true;
        }
    }
 }


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

//     var stations = [
//         { name: "Paddington", x: 25, y: 30 },   // 0
//         { name: "Liverpool St", x: 25, y: 70 },  // 1
//         { name: "Embankment", x: 65, y: 30 }, // 3
//         { name: "Temple", x: 65  , y: 70 },  // 2
//         { name: "Westminster", x: 45, y: 15 }, // 4
//         { name: "Charing Cross", x: 45, y: 85 }, // 5
//         { name: "Paddington", x: 85, y: 10 },   // 6
//         { name: "Paddington", x: 10, y: 85 },   // 7
//         //      { name: "St James Park", x: 25, y: 47 }, // 6
//   //      { name: "Holborn", x: 35, y: 10 }, // 7
//   //      { name: "Waterloo", x: 35, y: 47 }, // 8
//   //      { name: "Bank", x: 25, y: 15 }, // 9
//   //      { name: "Green Park", x: 46, y: 15 } // 10
//     ]

    var startStation = 5;
    var endStation = 6;


    var points = [
        { from: 0, to: 1 },
        { from: 2, to: 3 },
        { from: 1, to: 3 },
        { from: 0, to: 2 },
        { from: 4, to: 5 },
        { from: 6, to: 7 }
//        { from: 7, to: 8 },
//        { from: 9, to: 10 }
    ];

    this.getNode = function(x, y) {
        return this.grid[x][y];
    }

    //console.log("points:");
    //console.log(points);

    // Making a 2D array
    for (var i = 0; i < cols; i++) {
        this.grid[i] = [];
        this.map[i] = [];
    }

    // for (var i = 0; i < points.length; i++) {
    //     var fromStation = points[i].from;
    //     var toStation = points[i].to;

    //     if (stations[fromStation].y == stations[toStation].y) {
    //         for (var j = stations[fromStation].x; j <= stations[toStation].x; j++) {
    //             var r = stations[fromStation].y
    //             this.map[j][r] = true;
    //         }
    //     } else if (stations[fromStation].x == stations[toStation].x) {
    //         for (var j = stations[fromStation].y; j <= stations[toStation].y; j++) {
    //             var c = stations[fromStation].x
    //             this.map[c][j] = true;
    //         }
    //     }
    // }

    for (var i = 0; i < points.length; i++) {
        var fromStation = points[i].from;
        var toStation = points[i].to;
        drawLine(stations[fromStation].x, stations[fromStation].y, stations[toStation].x, stations[toStation].y, this.map)
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

    var startX = stations[startStation].x;
    var startY = stations[startStation].y;
    this.start = this.grid[startY][startX];

    var endX = stations[endStation].x;
    var endY = stations[endStation].y;
    this.end = this.grid[endY][endX];
    //this.end = this.grid[cols-1][rows-1];
    //this.end = this.grid[25][25];

}
