// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Part 1: https://youtu.be/aKYlikFAV4k
// Part 2: https://youtu.be/EaZxUCWAjb0
// Part 3: https://youtu.be/jwRT4PCT6RU

// 2 options for drawing the walls
// option 0 = corn maze
// option 1 = castle
// (Both look cool)
var drawingOption = 1;


//Set to true to allow diagonal moves
//This will also switch from Manhattan to Euclidean distance measures
var allowDiagonals = true;

// can the path go between the corners of two
// walls located diagonally next to each other
var canPassThroughCorners = false;

var cols = 100;
var rows = 100;


// % of cells that are walls
var percentWalls = (allowDiagonals ? (canPassThroughCorners ? 0.4 : 0.3) : 0.2);

// Timer
var t;
var timings = {};

function clearTimings() {
    timings = {};
}

function startTime() {
    t = millis();
}

function recordTime(n) {
    if (!timings[n]) {
        timings[n] = {
            sum: millis() - t,
            count: 1
        };
    } else {
        timings[n].sum = timings[n].sum + millis() - t;
        timings[n].count = timings[n].count + 1;
    }
}

function logTimings() {
    for (var prop in timings) {
        if (timings.hasOwnProperty(prop)) {
            console.log(prop + " = " + (timings[prop].sum / timings[prop].count).toString() + " ms");
        }
    }
}


function SettingBox(label, x, y, isSet, callback) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.isSet = isSet;
    this.callback = callback;

    this.show = function () {
        //noFill();
        strokeWeight(1);
        stroke(0);
        noFill();
        ellipse(this.x + 10, this.y + 10, 20, 20);
        if (this.isSet) {
            fill(0);
            ellipse(this.x + 10, this.y + 10, 3, 3);
        }
        fill(0);
        noStroke();
        text(label, this.x + 25, this.y + 15);
    }

    this.mouseClick = function (x, y) {
        if (x > this.x && x <= this.x + 20 &&
            y > this.y && y <= this.y + 20) {
            this.isSet = !this.isSet;
            if (this.callback != null)
                this.callback(this);
        }
    }
}

function Button(label, x, y, w, h, callback) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.callback = callback;

    this.show = function () {
        stroke(0);
        strokeWeight(1);
        noFill();
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        noStroke();
        text(this.label, this.x + 5, this.y + 5, this.w - 10, this.h - 10);
    }

    this.mouseClick = function (x, y) {
        if (this.callback != null &&
            x > this.x && x <= this.x + this.w &&
            y > this.y && y <= this.y + this.h) {
            this.callback(this);
        }
    }
}

// Start and end
// start = grid[0][0];
// end = grid[cols - 1][rows - 1];
// start.wall = false;
// end.wall = false;

function step(button) {
    pauseUnpause(true);
    stepsAllowed = 1;
}

function pauseUnpause(pause) {
    paused = pause;
    runPauseButton.label = paused ? "run" : "pause";
}

function runpause(button) {
    pauseUnpause(!paused);
}

function restart(button) {
    logTimings();
    clearTimings();
    initaliseSearchExample(cols, rows);
    pauseUnpause(true);
}

function toggleDiagonals() {
    allowDiagonals = !allowDiagonals;
}

function mouseClicked() {
    for (var i = 0; i < uiElements.length; i++) {
        uiElements[i].mouseClick(mouseX, mouseY);
    }

}

function doGUI() {
    for (var i = 0; i < uiElements.length; i++) {
        uiElements[i].show();
    }
}

var gamemap;
var uiElements = [];
var paused = true;
var pathfinder;
var status = "";
var stepsAllowed = 0;
var runPauseButton;
var trains;
var initPaths = [];
var i = 0;
const numTrains = 1;
var start = false;

function initaliseSearchExample(rows, cols) {
    mapGraphic = null;
    gamemap = new MapFactory().getMap(cols, rows, 10, 10, 500, 500, allowDiagonals, percentWalls);

    //start = gamemap.grid[0][0];
    //end = gamemap.grid[cols - 1][rows - 1];
    // start = gamemap.start;
    // end = gamemap.end;
    // start.wall = false;
    // end.wall = false;

    trains = new Trains();
    // Add an initial set of trains into the system
    for (var i = 0; i < numTrains; i++) {
        var t = new Train();
        trains.addTrain(t);
        initPaths.push(t.newPath());
    }

    initialise = function(t) {
        console.log("calling newPath");
        return t.newPath();
    }

    // Promise.all(initPaths).then(function (result) {
    //     console.log("finished initialising paths");
    //     loop();
    //     start = true;
    // })

    Promise.mapSeries(trains.trains, initialise).then(function() {
        console.log("finished");
        start = true;
        loop();
    });



    // pathfinder = new AStarPathFinder(gamemap, start, end, allowDiagonals);

    // pathfinder.findPath(start,end).then(function() {
    //     var path = calcPath(pathfinder.lastCheckedNode);
    //     drawPath(path);
    // }).catch(function(error) {
    //     console.log(error);
    // });
}

function setup() {

    noLoop();

    //    background(255);

    //doGUI();

    text("Search status - " + status, 10, 450);

    //   startTime();

    //    if (getURL().toLowerCase().indexOf("fullscreen") === -1) {
    createCanvas(1200, 600);
    //   } else {
    //        var sz = min(windowWidth, windowHeight);
    //       createCanvas(sz, sz);
    //      }
    console.log('A*');
    initaliseSearchExample(cols, rows);

    drawMap();

    // for (var i = 0; i < pathfinder.closedSet.length; i++) {
    //     pathfinder.closedSet[i].show(color(255, 0, 0, 50));
    //console.log("["+pathfinder.closedSet[i].i + "][" + pathfinder.closedSet[i].j +"]");
    // }

    var infoNode = null;

    // for (var i = 0; i < pathfinder.openSet.length; i++) {
    //     var node = pathfinder.openSet[i];
    //   //  node.show(color(0, 255, 0, 50));
    //     if (mouseX > node.x && mouseX < node.x + node.width &&
    //         mouseY > node.y && mouseY < node.y + node.height) {
    //         infoNode = node;
    //     }
    // }
    recordTime("Draw Grid");

    fill(0);
    if (infoNode != null) {
        text("f = " + infoNode.f, 430, 230);
        text("g = " + infoNode.g, 430, 250);
        text("h = " + infoNode.h, 430, 270);
        text("vh = " + infoNode.vh, 430, 290);
    }

    runPauseButton = new Button("run", 430, 20, 50, 30, runpause);
    uiElements.push(runPauseButton);
    uiElements.push(new Button("step", 430, 70, 50, 30, step));
    uiElements.push(new Button("restart", 430, 120, 50, 30, restart));
    uiElements.push(new SettingBox("AllowDiag", 430, 180, allowDiagonals, toggleDiagonals));

    recordTime("Setup");

    //var path = calcPath(pathfinder.lastCheckedNode);
    //console.log("path:");
    //console.log(path);

    //drawPath(path);

}

function searchStep() {
    if (!paused || stepsAllowed > 0) {
        startTime();
        var result = pathfinder.step();
        recordTime("AStar Iteration");
        stepsAllowed--;

        switch (result) {
            case -1:
                status = "No Solution";
                logTimings();
                pauseUnpause(true);
                break;
            case 1:
                status = "Goal Reached!";
                logTimings();
                pauseUnpause(true);
                break;
            case 0:
                status = "Still Searching"
                break;
        }
    }
}

var mapGraphic = null;

function drawMap() {
    if (mapGraphic == null) {
        for (var i = 0; i < gamemap.cols; i++) {
            for (var j = 0; j < gamemap.rows; j++) {
                if (gamemap.grid[i][j].wall) {
                    gamemap.grid[i][j].show(color(255));
                }
            }
        }
        mapGraphic = get(gamemap.x, gamemap.y, gamemap.w, gamemap.h);
    }

    image(mapGraphic, gamemap.x, gamemap.y);
}

function draw() {

    //     //searchStep();

    //     // Draw current state of everything
    background(255);

    //doGUI();

    //     text("Search status - " + status, 10, 450);

    //    startTime();

    drawMap();

    //     for (var i = 0; i < pathfinder.closedSet.length; i++) {
    //         pathfinder.closedSet[i].show(color(255, 0, 0, 50));
    //         //console.log("["+pathfinder.closedSet[i].i + "][" + pathfinder.closedSet[i].j +"]");
    //     }

    //     var infoNode = null;

    //     for (var i = 0; i < pathfinder.openSet.length; i++) {
    //         var node = pathfinder.openSet[i];
    //         node.show(color(0, 255, 0, 50));
    //         if (mouseX > node.x && mouseX < node.x + node.width &&
    //             mouseY > node.y && mouseY < node.y + node.height) {
    //             infoNode = node;
    //         }
    //     }
    //     recordTime("Draw Grid");

    //     fill(0);
    //     if (infoNode != null) {
    //         text("f = " + infoNode.f, 430, 230);
    //         text("g = " + infoNode.g, 430, 250);
    //         text("h = " + infoNode.h, 430, 270);
    //         text("vh = " + infoNode.vh, 430, 290);

    //     }

    //     var path = calcPath(pathfinder.lastCheckedNode);
    //     //console.log("path:");
    //     //console.log(path);

    //     drawPath(path);
    //console.log("trains:");
    //console.log(trains.trains[0].path);

    //console.log(trains);

    if (start) {
        trains.run();
    }
    // if (trains.trains[i].currentPos < trains.trains[i].path.length || 
    //     trains.trains[i].currentPos == 0) {
    //     trains.trains[i].show();
    //     trains.trains[i].move();

    // } else if (trains.trains[i].currentPos == trains.trains[i].path.length &&
    //     trains.trains[i].currentPos > 0) {
    //     var temp = trains.trains[i].start;
    //     trains.trains[i].start = trains.trains[i].end;
    //     trains.trains[i].end = temp;  
    //     trains.trains[i].path = [];
    //   noLoop();
    //     trains.trains[i].newPath().then(function(){
    //         // trains.trains[i].path = [];
    //  //       loop();
    //     }).catch(function(error) {
    //         console.log(error);
    //     });
    //     }
    // }
    // i++;
    // if (i == trains.trains.length) i=0;


}

function calcPath(endNode) {
    return new Promise((resolve, reject) => {

        startTime();
        // Find the path by working backwards
        path = [];
        var temp = endNode;
        path.push(temp);
        while (temp.previous && path.length < 2000) {
            path.push(temp.previous);
            temp = temp.previous;
            console.log("calcPath");
        }
        recordTime("Calc Path");
        resolve(path);

        //return path
    });
}

function drawPath(path) {
    // Drawing path as continuous line
    noFill();
    stroke(255, 0, 0);
    strokeWeight(gamemap.w / gamemap.cols / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].x + path[i].width / 2, path[i].y + path[i].height / 2);
        //        ellipse(path[i].x + path[i].width / 2, path[i].y + path[i].height / 2, 10, 10);

    }
    endShape();
}
