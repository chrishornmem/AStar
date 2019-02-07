function drawRoute(path) {

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function Trains() {
    this.trains = [];
}

Trains.prototype.run = function () {
   // console.log("trains run");

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
 //       console.log("newPath");

        var self = this;

        self.map.findPath(self.start, self.end).then(function () {
            return calcPath(self.map.lastCheckedNode);
        }).then(function(path) {
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
            reject();
        });
    });
}

Train.prototype.show = function() {
 //   console.log("show");

    var i = this.currentPos;
    if (i < this.path.length) {
        ellipse(this.path[i].x + this.path[i].width / 2, this.path[i].y + this.path[i].height / 2, 10, 10);
    }
}

Train.prototype.run = function (trains) {
  //  console.log("run");

    this.move(trains);
    this.render();
}

Train.prototype.move = function (trains) {
  //  console.log("move");

    //this.move(trains);
    if (this.path && this.currentPos < this.path.length) {
        this.currentPos++;
    } else if (this.currentPos == this.path.length) {
        this.currentPos = 0;
    }
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
            ellipse(this.path[i].x + this.path[i].width / 2, this.path[i].y + this.path[i].height / 2, 10, 10);
    
        //}
        //endShape();
     }

}


// Boid.prototype.render = function () {
//     fill(255, 0, 255);
//     noStroke();
//     ellipse(this.x, this.y, 15, 15);
// }


