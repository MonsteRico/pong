var Paddle = function(x, y, vel, width, height, direction, color) {
  var self = {};
  self.type = "paddle";
  self.x = x;
  self.y = y;
  self.vel = vel;
  self.width = width;
  self.height = height;
  self.direction = direction;
  self.score = 0;
  self.color = color;
  self.checkBounds = function() {
    if (self.x > maxX - self.width || self.x < minX || self.y > maxY - self.height || self.y < minY) {
      return true;
    } else {
      return false
    }
  }
  self.displayScore = false;
  self.move = function(posOrNeg) {
    //console.log(posOrNeg);
    var multiplier = 0;
    if (posOrNeg == "pos") {
      multiplier = -1;
    } else {
      multiplier = 1;
    }
    //console.log("multiplier is " + multiplier);
    var lastX = self.x;
    var lastY = self.y;
    if (self.direction == "LR") {
      self.x += (vel * multiplier);
    } else {
      self.y += (vel * multiplier);
    }
    if (self.checkBounds()) {
      self.x = lastX;
      self.y = lastY;
    }
    self.centerX = self.x + self.width / 2;
    self.centerY = self.y + self.height / 2;
    //console.log("centerX is " + self.centerX);
    //console.log("centerY is " + self.centerY);
  }
  return self;
}


var Ball = function(x, y, radius, velX, velY, color) {
  var self = {};
  self.type = "ball";
  self.x = x;
  self.y = y;
  self.radius = radius;
  self.velX = velX;
  self.velY = velY;
  self.color = color;
  self.speed = 5;
  self.move = function() {
    self.x += self.velX;
    self.y += self.velY;
  }
  return self;
}
var velX = 0;
var velY = 0;
while (velX <= 1 && velX >= -1) {
  velX = Math.floor(Math.random() * (+7 - + -7)) + + -7;
}
while (velY <= 1 && velY >= -1) {
  velY = Math.floor(Math.random() * (+7 - + -7)) + + -7;
}
var maxX = 700;
var maxY = 700;
var minX = 0;
var minY = 0;
var ball1 = Ball(maxX / 2, maxY / 2, 10, velX, velY, "green");
var canvas = {
  width: 700,
  height: 700
};

{
  var express = require('express');
  var app = express();
  var serv = require('http').Server(app);



  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
  });
  app.use('/client', express.static(__dirname + '/client'));
  serv.listen(process.env.PORT || 2000);
  console.log("server started");
}

var Player = function(id, name, color) {
  var self = {};
  self.id = id;
  self.name = name;
  self.color = color;
  self.ready = "unready";
  self.paddle = null;
  return self;
}

var gameState = "prep";
var SOCKET_LIST = {};
var PLAYER_LIST = {};
var readyList = [];
var paddlesMade = false;
var paddleArray = [];
var io = require('socket.io')(serv, {});



io.sockets.on('connection', function(socket) {
  // SOCKET CODE IN HERE Stuff that runs whenever
  // a client connects to the server
  console.log('socket connection');
  socket.id = Math.random();
  var socketNum = Math.floor(socket.id * 100);
  SOCKET_LIST[socket.id] = socket;
  PLAYER_LIST[socket.id] = Player(socket.id, socketNum, "blue");

  socket.on('disconnect', function() {
    delete SOCKET_LIST[socket.id];
    delete PLAYER_LIST[socket.id];
  });

  socket.on('updatePlayer', function(data) {
    var nameGood = true;
    for (var i in PLAYER_LIST) {
      if ((PLAYER_LIST[i].name == data.name) && (PLAYER_LIST[i].id != socket.id)) {
        nameGood = false;
      }
    }
    if (nameGood) {
      PLAYER_LIST[socket.id].name = data.name;
      PLAYER_LIST[socket.id].color = data.color;
    } else {
      socket.emit('badName')
    }
  });

  socket.on('readyUp', function(data) {
    PLAYER_LIST[socket.id].ready = data;
    if (data == "ready") {
      readyList.push(PLAYER_LIST[socket.id]);
    } else {
      for (var i in readyList) {
        if (readyList[i].name == PLAYER_LIST[socket.id].name) {
          readyList.splice(i, 1);
        }
      }
    }
    if (readyList.length == 4) {
      gameState = "play";
    }
  });

  socket.on('keyPress', function(data) {
    if (gameState == "play") {
      for (var i in readyList) {
        if (socket.id == readyList[i].id) {
          if (readyList[i].paddle.direction == "LR") {
            if (data.inputId == "left") {
              if (data.state) {
                readyList[i].paddle.move("pos");
              }
            } else if (data.inputId == "right") {
              if (data.state) {
                readyList[i].paddle.move("neg");
              }
            }
          }
          if (readyList[i].paddle.direction == "UD") {
            if (data.inputId == "up") {
              if (data.state) {
                readyList[i].paddle.move("pos");
              }
            } else if (data.inputId == "down") {
              if (data.state) {
                readyList[i].paddle.move("neg");
              }
            }
          }
        }
      }
    }
  });

});

setInterval(function() {
  //UPDATE FUNCTION
  var pack = {};
  pack.state = gameState;
  pack.playerList = PLAYER_LIST;
  if (gameState == "play") {
    if (!paddlesMade) {
      paddlesMade = true;
      var paddle1 = Paddle(10, maxY / 2, 10, 10, 100, "UD", readyList[0].color);
      var paddle2 = Paddle(maxX - 20, maxY / 2, 10, 10, 100, "UD", readyList[1].color);
      var paddle3 = Paddle(maxX / 2 - 50, 10, 10, 100, 10, "LR", readyList[2].color);
      var paddle4 = Paddle(maxX / 2 - 50, maxY - 20, 10, 100, 10, "LR", readyList[3].color);
      readyList[0].paddle = paddle1;
      readyList[1].paddle = paddle2;
      readyList[2].paddle = paddle3;
      readyList[3].paddle = paddle4;
      paddleArray[0] = paddle1;
      paddleArray[1] = paddle2;
      paddleArray[2] = paddle3;
      paddleArray[3] = paddle4;
    }
    ball1.move();
    if (ball1.x > maxX - ball1.radius || ball1.x < minX) {
      for (var i = 0; i < paddleArray.length; i++) {
        if (ball1.color == paddleArray[i].color) {
          paddleArray[i].score++;
          console.log(paddleArray[i].color + " paddle score is " + paddleArray[i].score);
          paddleArray[i].displayScore = true;
          setTimeout(function() {
            for (var i = 0; i < paddleArray.length; i++) {
              if (paddleArray[i].displayScore = true) {
                paddleArray[i].displayScore = false;
              }
            }
          }, 1000);
        }
      }
      ball1.color = "green";
      ball1.velX = 0;
      ball1.velY = 0;
      while (ball1.velX <= 1 && ball1.velX >= -1) {
        ball1.velX = Math.floor(Math.random() * (+7 - + -7)) + + -7;
      }
      while (ball1.velY <= 1 && ball1.velY >= -1) {
        ball1.velY = Math.floor(Math.random() * (+7 - + -7)) + + -7;
      }
      ball1.x = maxX / 2;
      ball1.y = maxY / 2;
      ball1.speed = 5;
    }
    if (ball1.y > maxY - ball1.radius || ball1.y < minY) {
      for (var i = 0; i < paddleArray.length; i++) {
        if (ball1.color == paddleArray[i].color) {
          paddleArray[i].score++;
          paddleArray[i].displayScore = true;
          setTimeout(function() {
            for (var i = 0; i < paddleArray.length; i++) {
              if (paddleArray[i].displayScore = true) {
                paddleArray[i].displayScore = false;
              }
            }
          }, 1000);
          console.log(paddleArray[i].color + " paddle score is " + paddleArray[i].score);
        }
      }
      ball1.color = "green";
      ball1.velX = 0;
      ball1.velY = 0;
      while (ball1.velX <= 1 && ball1.velX >= -1) {
        ball1.velX = Math.floor(Math.random() * (+7 - + -7)) + + -7;
      }
      while (ball1.velY <= 1 && ball1.velY >= -1) {
        ball1.velY = Math.floor(Math.random() * (+7 - + -7)) + + -7;
      }
      ball1.x = maxX / 2;
      ball1.y = maxY / 2;
      ball1.speed = 7;
    }
    //console.log(ball1);
    if (ball1.x > paddleArray[0].x && ball1.x < paddleArray[0].x + paddleArray[0].width && ball1.y > paddleArray[0].y && ball1.y < paddleArray[0].y + paddleArray[0].height) {
      console.log("TOUCHING PADDLE 1");

      ball1.color = paddleArray[0].color;
      let collidePoint = (ball1.y - (paddleArray[0].y + paddleArray[0].height / 2));
      // normalize the value of collidePoint, we need to get numbers between -1 and 1.
      // -player.height/2 < collide Point < player.height/2
      collidePoint = collidePoint / (paddleArray[0].height / 2);

      // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
      // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
      // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
      // Math.PI/4 = 45degrees
      let angleRad = (5 * Math.PI / 12) * collidePoint;

      // change the X and Y velocity direction
      let direction = (ball1.x + ball1.radius < canvas.width / 2) ? 1 : -1;
      ball1.velX = direction * ball1.speed * Math.cos(angleRad);
      ball1.velY = ball1.speed * Math.sin(angleRad);

      // speed up the ball everytime a paddle hits it.
      ball1.speed += 0.1;
    }
    if (ball1.x > paddleArray[1].x && ball1.x < paddleArray[1].x + paddleArray[1].width && ball1.y > paddleArray[1].y && ball1.y < paddleArray[1].y + paddleArray[1].height) {
      console.log("TOUCHING PADDLE 2");
      ball1.color = paddleArray[1].color;
      let collidePoint = (ball1.y - (paddleArray[1].y + paddleArray[1].height / 2));
      // normalize the value of collidePoint, we need to get numbers between -1 and 1.
      // -player.height/2 < collide Point < player.height/2
      collidePoint = collidePoint / (paddleArray[1].height / 2);

      // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
      // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
      // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
      // Math.PI/4 = 45degrees
      let angleRad = (5 * Math.PI / 12) * collidePoint;

      // change the X and Y velocity direction
      let direction = (ball1.x + ball1.radius < canvas.width / 2) ? 1 : -1;
      ball1.velX = direction * ball1.speed * Math.cos(angleRad);
      ball1.velY = ball1.speed * Math.sin(angleRad);

      // speed up the ball everytime a paddle hits it.
      ball1.speed += 0.1;
    }
    if (ball1.x > paddleArray[2].x && ball1.x < paddleArray[2].x + paddleArray[2].width && ball1.y > paddleArray[2].y && ball1.y < paddleArray[2].y + paddleArray[2].height) {
      console.log("TOUCHING PADDLE 3");

      ball1.color = paddleArray[2].color;
      let collidePoint = (ball1.x - (paddleArray[2].x + paddleArray[2].width / 2));
      // normalize the value of collidePoint, we need to get numbers between -1 and 1.
      // -player.height/2 < collide Point < player.height/2
      collidePoint = collidePoint / (paddleArray[2].width / 2);

      // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
      // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
      // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
      // Math.PI/4 = 45degrees
      let angleRad = (5 * Math.PI / 12) * collidePoint;

      // change the X and Y velocity direction
      let direction = (ball1.y + ball1.radius < canvas.height / 2) ? 1 : -1;
      ball1.velY = direction * ball1.speed * Math.cos(angleRad);
      ball1.velX = ball1.speed * Math.sin(angleRad);

      // speed up the ball everytime a paddle hits it.
      ball1.speed += 0.1;
    }
    if (ball1.x > paddleArray[3].x && ball1.x < paddleArray[3].x + paddleArray[3].width && ball1.y > paddleArray[3].y && ball1.y < paddleArray[3].y + paddleArray[3].height) {
      console.log("TOUCHING PADDLE 3");

      ball1.color = paddleArray[3].color;
      let collidePoint = (ball1.x - (paddleArray[3].x + paddleArray[3].width / 2));
      // normalize the value of collidePoint, we need to get numbers between -1 and 1.
      // -player.height/2 < collide Point < player.height/2
      collidePoint = collidePoint / (paddleArray[3].width / 2);

      // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
      // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
      // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
      // Math.PI/4 = 45degrees
      let angleRad = (5 * Math.PI / 12) * collidePoint;

      // change the X and Y velocity direction
      let direction = (ball1.y + ball1.radius < canvas.height / 2) ? 1 : -1;
      ball1.velY = direction * ball1.speed * Math.cos(angleRad);
      ball1.velX = ball1.speed * Math.sin(angleRad);

      // speed up the ball everytime a paddle hits it.
      ball1.speed += 0.1;
    }



    pack.ball = ball1;
    pack.paddleArray = paddleArray;
  }
  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i];
    socket.emit('update', pack);
  }

}, 1000 / 50);