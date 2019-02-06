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

    console.log("startStation");
    console.log(startStation);
    console.log("endStation");
    console.log(endStation);

    var self = this;

    this.startX = stations[startStation].x;
    this.startY = stations[startStation].y;
    this.endX = stations[endStation].x;
    this.endY = stations[endStation].y;

    this.start = gamemap.getNode(this.startX, this.startY);
    this.end = gamemap.getNode(this.endX, this.endY);

}

Train.prototype.findPath = function () {
    return new Promise((resolve, reject) => {

        var map = new AStarPathFinder(gamemap, this.start, this.end, allowDiagonals);

        map.findPath(this.start, this.end).then(function () {
            self.path = calcPath(map.lastCheckedNode);
            console.log("found path");
            console.log(this.path);
            resolve(this.path);
            //this.x = this.startX;
            //this.y = this.startY;
        }).catch(function (error) {
            console.log(error);
            reject();
        });
    });
}

Train.prototype.run = function (trains) {
    //this.move(trains);
    this.drawRoute();
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

Train.prototype.move = function (trains) {

}

// Boid.prototype.render = function () {
//     fill(255, 0, 255);
//     noStroke();
//     ellipse(this.x, this.y, 15, 15);
// }


