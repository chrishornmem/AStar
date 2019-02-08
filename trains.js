var colors = [
    "red",
    "blue",
    "yellow",
    "green",
    "purple",
    "black",
    "brown"
]

function drawRoute(path) {

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function Trains() {
    this.trains = [];
}

Trains.prototype.run = function () {
  //console.log("trains run");

    for (var i = 0; i < this.trains.length; i++) {
        this.trains[i].run(this.trains);  // Passing the entire list of trains to each train individually
    }
}

Trains.prototype.addTrain = function (t) {
    this.trains.push(t);
}

function Train(cols, rows, map, x, y, w, h) {

    this.cols = cols;
    this.rows = rows;

    // This will the 2D array
    // this.grid = [];
    this.path = [];
    this.map = [];

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    var colorIndex = getRandomInt(colors.length);
    this.color = colors[colorIndex];
    
    var startStation = getRandomInt(stations.length);
    var endStation = getRandomInt(stations.length);
    while (endStation === startStation) {
        endStation = getRandomInt(stations.length);
    }

    //startStation=0;
    //endStation=2;

    console.log("startStation");
    console.log(startStation);
    console.log("endStation");
    console.log(endStation);

    var self = this;

    self.grid = [];
    // Making a 2D array
    for (var i = 0; i < cols; i++) {
        self.grid[i] = [];
    }

    self.startY = stations[startStation].y;
    self.startX = stations[startStation].x;
    self.endY = stations[endStation].y;
    self.endX = stations[endStation].x;

    var isWall, ad = undefined;
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (!map[i][j]) {
                isWall = true;
            } else {
                isWall = false;
                ad = map[i][j].allowedDirections;
            }
            self.grid[i][j] = new Spot(i, j, x + i * w / cols, y + j * h / rows, w / cols, h / rows, isWall, self.grid, ad);
        }
    }

    self.start = self.grid[self.startY][self.startX];
    self.end = self.grid[self.endY][self.endX];
    self.start.wall = false;
    self.end.wall = false;

    self.forwards = true;
    self.currentPos = 0;

    self.path = [];

}

Train.prototype.newPath = function () {
    return new Promise((resolve, reject) => {
        console.log("newPath");
        console.log("start");
        console.log(this.start);
        console.log("end");
        console.log(this.end);

        var self = this;
        self.map = new AStarPathFinder(gamemap, this.start, this.end, allowDiagonals);

        self.map.findPath(self.start, self.end).then(function () {
            return calcPath(self.map.lastCheckedNode);
        }).then(function (path) {
            self.path = path;
            console.log("called calcPath");
            console.log(self.path);
            //self.path = path;
            self.start.wall = false;
            self.end.wall = false;
            self.currentPos = 0;

            //console.log("found path");
            //console.log(self.path);
            resolve(self.path);
            //this.x = this.startX;
            //this.y = this.startY;
        }).catch(function (error) {
            console.log(error);
            self.path = [];
            reject(error);
        });
    });
}

Train.prototype.show = function () {
    //   console.log("show");

    var i = this.currentPos;
    if (i < this.path.length) {
        fill("red");
        noStroke();
        ellipse(this.path[i].x + this.path[i].width / 2, this.path[i].y + this.path[i].height / 2, 80, 80);
    }
}

Train.prototype.run = function (trains) {
    //  console.log("run");
    if (this.path.length > 0) {
        this.move(trains);
        this.render();
    }
}

Train.prototype.move = function (trains) {
    //  console.log("move");

    function bounce () {
        if (this.path && this.currentPos == 0 && !this.forwards) {
            this.currentPos++;
            this.forwards = !this.forwards;
        } else if (this.path && this.currentPos == this.path.length && this.forwards) {
            this.currentPos--;
            this.forwards = !this.forwards;
        } else if (this.path && this.currentPos < this.path.length && this.forwards) {
            this.currentPos++;
        } else if (this.path && this.currentPos < this.path.length && !this.forwards) {
            this.currentPos--;
        }
    }

    if (this.currentPos == this.path.length)
        this.currentPos = 0;
    else
        this.currentPos++;

}

Train.prototype.render = function () {
    //    console.log("render");
    var i = this.currentPos;
    if (this.path[i]) {
        //  noFill();
        //  stroke(255, 0, 0);
        //  strokeWeight(gamemap.w / gamemap.cols / 2);

        //console.log("this.path[i]");
        //      console.log(this.path[i].x);
        //      console.log(this.path[i].y);
        //beginShape();
        //for (var i = 0; i < this.path.length; i++) {
        //        vertex(path[i].x + path[i].width / 2, path[i].y + path[i].height / 2);

        fill(this.color);
        noStroke();
        ellipse(this.path[i].x + this.path[i].width / 2, this.path[i].y + this.path[i].height / 2, 15, 15);

        //}
        //endShape();
    }

}


// Boid.prototype.render = function () {
//     fill(255, 0, 255);
//     noStroke();
//     ellipse(this.x, this.y, 15, 15);
// }


