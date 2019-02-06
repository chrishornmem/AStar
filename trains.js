function drawRoute(path) {

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function Trains() {
    this.trains = [];
}

Trains.prototype.run = function () {
    for (var i = 0; i < this.trains.length; i++) {
        this.trains[i].run(this.trains);  // Passing the entire list of trains to each train individually
    }
}

Trains.prototype.addTrain = function (t) {
    this.trains.push(t);
}

function Train() {

    var startStation = getRandomInt(stations.length);
    var endStation = getRandomInt(stations.length);
    while (endStation === startStation) {
        endStation = getRandomInt(stations.length);
    }

    console.log("startStation");
    console.log(startStation);
    console.log("endStation");
    console.log(endStation);

    var self = this;

    self.startY = stations[startStation].y;
    self.startX = stations[startStation].x;
    self.endY = stations[endStation].y;
    self.endX = stations[endStation].x;

    self.start = gamemap.getNode(self.startY, self.startX);
    self.end = gamemap.getNode(self.endY, self.endX);
    self.start.wall = false;
    self.end.wall = false;

    self.reachedEnd = false;
    self.currentPos = 0;

    self.path = [];
    self.map = new AStarPathFinder(gamemap, this.start, this.end, allowDiagonals);

}

Train.prototype.newPath = function () {
    return new Promise((resolve, reject) => {

        var self = this;

        self.map.findPath(self.start, self.end).then(function (path) {
            self.path = calcPath(self.map.lastCheckedNode);
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
            reject();
        });
    });
}

Train.prototype.show = function() {
    var i = this.currentPos;
    if (i < this.path.length) {
        ellipse(this.path[i].x + this.path[i].width / 2, this.path[i].y + this.path[i].height / 2, 10, 10);
    }
}

Train.prototype.move = function (trains) {
    //this.move(trains);
    if (this.currentPos < this.path.length) {
        this.currentPos++;
    }
}

Train.prototype.run = function (trains) {
    //this.move(trains);
    //this.drawRoute();
}

Train.prototype.drawRoute = function () {
    // Drawing path as continuous line
    noFill();
    stroke(255, 0, 0);
    strokeWeight(gamemap.w / gamemap.cols / 2);
    //beginShape();
    for (var i = 0; i < this.path.length; i++) {
        //        vertex(path[i].x + path[i].width / 2, path[i].y + path[i].height / 2);
        ellipse(this.path[i].x + this.path[i].width / 2, this.path[i].y + this.path[i].height / 2, 10, 10);

    }
    //endShape();
}


// Boid.prototype.render = function () {
//     fill(255, 0, 255);
//     noStroke();
//     ellipse(this.x, this.y, 15, 15);
// }


