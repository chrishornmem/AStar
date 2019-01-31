

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

    var line1End = Math.round(rows / 3);
    var line2End = Math.round(cols / 2);

    //console.log(line1End);
    //console.log(line2End);

    var points = [
        { from: [0, 0], to: [line1End, 0] },
        { from: [line1End, 0], to: [line1End, line2End] },
        { from: [line1End, line2End], to: [rows-1, line2End] },
        { from: [rows-1, line2End], to: [rows-1, cols-1] }
    ];

    // Making a 2D array
    for (var i = 0; i < cols; i++) {
        this.grid[i] = [];
        this.map[i] = [];
    }
//debugger;
    for (var i = 0; i < points.length; i++) {
        //console.log("points:" + i);
        if (points[i].from[1] == points[i].to[1]) {
            console.log("first");
            for (var j = points[i].from[0]; j <= points[i].to[0]; j++) {
                x = points[i].from[1]
                this.map[x][j] = true;
            //    console.log("x="+x+","+"j="+j);
            }
        } else if (points[i].from[0] == points[i].to[0]) {
            console.log("second");
            for (var j = points[i].from[1]; j <= points[i].to[1]; j++) {
                y = points[i].from[0]
                this.map[j][y] = true;
            //    console.log("j="+j+","+"y="+y);
            }
        }
    }

    var isWall;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            isWall = false;
            if (!this.map[i][j]) {
                isWall = true;
            } else {
                console.log("map["+i+"]["+j+"]"+this.map[i][j]);
            }
            this.grid[i][j] = new Spot(i, j, x + i * w / cols, y + j * h / rows, w / cols, h / rows, isWall, this.grid);
        }
    }

    // for (var i = 0; i < cols; i++) {
    //     for (var j = 0; j < rows; j++) {
    //         var isWall = random(1.0) < wallRatio;
    //         this.grid[i][j] = new Spot(i, j, x + i * w / cols, y + j * h / rows, w / cols, h / rows, isWall, this.grid);
    //     }
    // }

    //for (var i = 0; i < cols; i++) {
    //    for (var j = 0; j < rows; j++) {
    //        this.grid[i][j].addNeighbors(this.grid, allowDiagonals);
    //    }
    //}
}
