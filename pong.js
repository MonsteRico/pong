// This is the code for the entire game.
// NOT ALL CODE IS WRITTEN BY ME. I DO NOT KNOW THE OC'S OF EVERYTHING. W3, QUORA, AND GOOGLE ARE ALL MAJOR CONTRIBUTORS.
// Sets up the game world canvas
var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  keys = [];
  canvas.width = window.innerWidth - 100;
  canvas.height = window.innerHeight - 100;
  var screenWidth = canvas.width,
  screenHeight = canvas.height,
  maxX = screenWidth,
  maxY = screenHeight,
  minX = 0,
  minY = 0,
  paddleArray = [];
class paddle {
	constructor (x,y,vel,width,height,direction,color) {
		this.x = x;
		this.y = y;
		this.vel = vel;
		this.width = width;
		this.height = height;
		this.direction = direction;
		this.score = 0;
		this.color = color;
		this.draw = function() {
		  ctx.fill();
		  ctx.globalAlpha = 1;
		  ctx.fillStyle = this.color;
		  ctx.fillRect(this.x, this.y, this.width, this.height);
		  if (this.displayScore) {
			  ctx.font = "200px Arial";
			ctx.fillStyle = this.color;
			ctx.fillText(this.score, screenWidth/2, screenHeight/2);
		    }
		}
		this.checkBounds = function() {
			if (this.x > maxX-this.width || this.x < minX || this.y > maxY-this.height || this.y < minY) {
				return true;
			}
			else {
				return false
			}
		}
		this.displayScore = false;
		this.move = function(posOrNeg) {
		  //console.log(posOrNeg);
		  var multiplier = 0;
			if (posOrNeg == "pos") {
				multiplier = -1;
			}
			else {
				multiplier = 1;
			}
			//console.log("multiplier is " + multiplier);
		  var lastX = this.x;
		  var lastY = this.y;
		  if (this.direction == "LR") {
			  this.x += (vel*multiplier);
		  }
		  else {
			  this.y += (vel*multiplier);
		  }
		  if (this.checkBounds()) {
			  this.x = lastX;
			  this.y = lastY;
		  }
		  this.centerX = this.x+this.width/2;
		  this.centerY = this.y+this.height/2;
		  //console.log("centerX is " + this.centerX);
		  //console.log("centerY is " + this.centerY);
		}
		paddleArray.push(this);
	}
}
 
class ball {
	constructor (x,y,radius,velX, velY,color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.velX = velX;
		this.velY = velY;
		this.color = color;
		this.speed = 5;
		this.draw = function() {
		  ctx.fillStyle = this.color;
		  ctx.beginPath();
		  ctx.arc(this.x, this.y, this.radius, 0, 360);
		  ctx.fill();
		}
		this.clear = function() {
			ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius+.4, 0, 360);
			ctx.fill();
		}
		this.colChecks = function() {
			
		}
		this.move = function() {
			this.x+=this.velX;
			this.y+=this.velY;
		}
	}
}
var velX = 0;
var velY = 0;
while (velX <= 1 && velX >= -1) {
	velX = randomNumber(-7, 7);
}
while (velY <= 1 && velY >= -1) {
	velY = randomNumber(-7, 7);
}
var paddle1 = new paddle(10,screenHeight/2,10,10,100,"UD","blue");
var paddle2 = new paddle(screenWidth-20,screenHeight/2,10,10,100,"UD","purple");
var paddle3 = new paddle(screenWidth/2-50,10,10,100,10,"LR","black");
var paddle4 = new paddle(screenWidth/2-50,screenHeight-20,10,100,10,"LR","red");
var ball1= new ball(screenWidth/2,screenHeight/2,10,velX,velY,"green");
var gameState = "4player";
// Animation stuff I don't fully understand. I think it just sets up variables to use for request and cancel animation. not sure how
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
})();


function update() {
  // The function that Runs the entire game
  if (gameState == "2player") {
  // check keys
  if (keys[87]) {
    // w
	paddle1.move("pos");
  }
  if (keys[83]) {
    // s
	paddle1.move("neg");
  }
  if (keys[38]) {
    // w
	paddle2.move("pos");
  }
  if (keys[40]) {
    // s
	paddle2.move("neg");
  }
  ctx.clearRect(0,0,screenWidth,screenHeight);
  paddle1.draw();
  paddle2.draw();
  ball1.clear();
  ball1.move();
  if (ball1.x > maxX-ball1.radius || ball1.x < minX) {
				for (var i = 0; i <paddleArray.length; i++) {
				  if (ball1.color == paddleArray[i].color) {
				    paddleArray[i].score++;
				    console.log(paddleArray[i].color + " paddle score is " + paddleArray[i].score);
				    	  paddleArray[i].displayScore = true;
				    setTimeout(resetScore(paddleArray[i]), 2000);
				  }
				}
				ball1.color = "green";
	  ball1.velX = 0;
	  ball1.velY = 0;
				while (ball1.velX <= 1 && ball1.velX >= -1) {
	ball1.velX = randomNumber(-7, 7);
}
while (ball1.velY <= 1 && ball1.velY >= -1) {
	ball1.velY = randomNumber(-7, 7);
}
				ball1.x = screenWidth/2;
				ball1.y = screenHeight/2;
				ball1.speed = 5;
			}
			if (ball1.y > maxY-ball1.radius || ball1.y < minY) {
        ball1.velY *= -1;
			}
			//console.log(ball1);
  if (ball1.x > paddle1.x && ball1.x < paddle1.x+paddle1.width && ball1.y > paddle1.y && ball1.y < paddle1.y+paddle1.height) {
	  console.log("TOUCHING PADDLE 1");
	  
	  ball1.color = paddle1.color;
	  let collidePoint = (ball1.y - (paddle1.y + paddle1.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (paddle1.height/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (5*Math.PI/12) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball1.x + ball1.radius < canvas.width/2) ? 1 : -1;
        ball1.velX = direction * ball1.speed * Math.cos(angleRad);
        ball1.velY = ball1.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball1.speed += 0.1;
  }
	if (ball1.x > paddle2.x && ball1.x < paddle2.x+paddle2.width && ball1.y > paddle2.y && ball1.y < paddle2.y+paddle2.height) {
	  console.log("TOUCHING PADDLE 2");
	  ball1.color = paddle2.color;
	 let collidePoint = (ball1.y - (paddle2.y + paddle2.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (paddle2.height/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (5*Math.PI/12) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball1.x + ball1.radius < canvas.width/2) ? 1 : -1;
        ball1.velX = direction * ball1.speed * Math.cos(angleRad);
        ball1.velY = ball1.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball1.speed += 0.1;
  }
  ball1.draw();
  }
  
  
  
  
  if (gameState == "4player") {
    // check keys
  if (keys[87]) {
    // w
	paddle1.move("pos");
  }
  if (keys[65]) {
    // a
    paddle3.move("pos");
  }
  if (keys[68]) {
    // d
    paddle3.move("neg");
  }
  if (keys[37]) {
    // left
    paddle4.move("pos");
  }
  if (keys[39]) {
    // right
    paddle4.move("neg");
  }
  if (keys[83]) {
    // s
	paddle1.move("neg");
  }
  if (keys[38]) {
    // up
	paddle2.move("pos");
  }
  if (keys[40]) {
    // down
	paddle2.move("neg");
  }
  ctx.clearRect(0,0,screenWidth,screenHeight);
  paddle1.draw();
  paddle2.draw();
  paddle3.draw();
  paddle4.draw();
  ball1.clear();
  ball1.move();
  if (ball1.x > maxX-ball1.radius || ball1.x < minX) {
				for (var i = 0; i <paddleArray.length; i++) {
				  if (ball1.color == paddleArray[i].color) {
				    paddleArray[i].score++;
				    console.log(paddleArray[i].color + " paddle score is " + paddleArray[i].score);
					  paddleArray[i].displayScore = true;
				    	  setTimeout(function() {for (var i = 0; i< paddleArray.length; i++) {
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
	ball1.velX = randomNumber(-7, 7);
}
while (ball1.velY <= 1 && ball1.velY >= -1) {
	ball1.velY = randomNumber(-7, 7);
}
				ball1.x = screenWidth/2;
				ball1.y = screenHeight/2;
				ball1.speed = 5;
			}
			if (ball1.y > maxY-ball1.radius || ball1.y < minY) {
				for (var i = 0; i <paddleArray.length; i++) {
				  if (ball1.color == paddleArray[i].color) {
				    paddleArray[i].score++;
					  	  paddleArray[i].displayScore = true;
				    setTimeout(function() {for (var i = 0; i< paddleArray.length; i++) {
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
	ball1.velX = randomNumber(-7, 7);
}
while (ball1.velY <= 1 && ball1.velY >= -1) {
	ball1.velY = randomNumber(-7, 7);
}
				ball1.x = screenWidth/2;
				ball1.y = screenHeight/2;
				ball1.speed = 7;
			}
			//console.log(ball1);
  if (ball1.x > paddle1.x && ball1.x < paddle1.x+paddle1.width && ball1.y > paddle1.y && ball1.y < paddle1.y+paddle1.height) {
	  console.log("TOUCHING PADDLE 1");
	  
	  ball1.color = paddle1.color;
	  let collidePoint = (ball1.y - (paddle1.y + paddle1.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (paddle1.height/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (5*Math.PI/12) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball1.x + ball1.radius < canvas.width/2) ? 1 : -1;
        ball1.velX = direction * ball1.speed * Math.cos(angleRad);
        ball1.velY = ball1.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball1.speed += 0.1;
  }
	if (ball1.x > paddle2.x && ball1.x < paddle2.x+paddle2.width && ball1.y > paddle2.y && ball1.y < paddle2.y+paddle2.height) {
	  console.log("TOUCHING PADDLE 2");
	  ball1.color = paddle2.color;
	 let collidePoint = (ball1.y - (paddle2.y + paddle2.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (paddle2.height/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (5*Math.PI/12) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball1.x + ball1.radius < canvas.width/2) ? 1 : -1;
        ball1.velX = direction * ball1.speed * Math.cos(angleRad);
        ball1.velY = ball1.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball1.speed += 0.1;
  }
    if (ball1.x > paddle3.x && ball1.x < paddle3.x+paddle3.width && ball1.y > paddle3.y && ball1.y < paddle3.y+paddle3.height) {
	  console.log("TOUCHING PADDLE 3");
	  
	  ball1.color = paddle3.color;
	  let collidePoint = (ball1.x - (paddle3.x + paddle3.width/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (paddle3.width/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (5*Math.PI/12) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball1.y + ball1.radius < canvas.height/2) ? 1 : -1;
        ball1.velY = direction * ball1.speed * Math.cos(angleRad);
        ball1.velX = ball1.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball1.speed += 0.1;
  }
       if (ball1.x > paddle4.x && ball1.x < paddle4.x+paddle4.width && ball1.y > paddle4.y && ball1.y < paddle4.y+paddle4.height) {
	  console.log("TOUCHING PADDLE 3");
	  
	  ball1.color = paddle4.color;
	  let collidePoint = (ball1.x - (paddle4.x + paddle4.width/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (paddle4.width/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (5*Math.PI/12) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball1.y + ball1.radius < canvas.height/2) ? 1 : -1;
        ball1.velY = direction * ball1.speed * Math.cos(angleRad);
        ball1.velX = ball1.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball1.speed += 0.1;
  }
  ball1.draw();
    
  }
  // dont understand this but updates the animation
  requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
  // DONT FULLY UNDERSTAND Collisions yet but here they are.
  // get the vectors to check against
  var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
    vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2) ),
    // add the half widths and half heights of the objects
    hWidths = (shapeA.width / 2) + (shapeB.width / 2),
    hHeights = (shapeA.height / 2) + (shapeB.height / 2),
    colDir = null;
  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    // figures out on which side we are colliding (top, bottom, left, or right)
    var oX = hWidths - Math.abs(vX),
      oY = hHeights - Math.abs(vY);
    if (oX >= oY) {
      if (vY > 0) {
        colDir = "t";
        shapeA.y += oY;
      } else {
        colDir = "b";
        shapeA.y -= oY;
      }
    } else {
      if (vX > 0) {
        colDir = "l";
        shapeA.x += oX;
      } else {
        colDir = "r";
        shapeA.x -= oX;
      }
    }
  }
  return colDir;
}

// Checks for keys moving down and up
document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});

function resetScore(paddle) {
	paddle.displayScore = false;
	console.log(paddle.displayScore);
}
