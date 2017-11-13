var canvas;
var ctx;
var ballX = 50;
var ballY = 100;
var ballSpeedX = 5;
var ballSpeedY = 5;

player1Score = 0;
player2Score = 0;
const WiningScore = 3;

var showingWinScreen = false;

var paddle1Y;
var paddle2Y = 40;
const PaddleThickness = 10;

const PaddleHeight = 100;

window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  var framePerSecond = 60;

  canvas.addEventListener("mousemove", function() {
    var mousePos = calculateMousePos();
    paddle1Y = mousePos.y - PaddleHeight / 2;
  });

  canvas.addEventListener("mousedown", handleMouseClick);

  setInterval(callBoth, 1000 / framePerSecond);
};

//Click to continue
function handleMouseClick() {
  if (showingWinScreen) {
    //Resets score
    player1Score = 0;
    player2Score = 0;
    //Returns to the game
    showingWinScreen = false;
  }
}

//Retrieve user mouse X,Y
function calculateMousePos() {
  var x = event.clientX;
  var y = event.clientY;
  return {
    x,
    y
  };
}

//Resets Ball
function ballReset() {
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedY = 5;
  if (player1Score >= WiningScore || player2Score >= WiningScore) {
    showingWinScreen = true;
  }
}

//Calls Draw&Move functions
function callBoth() {
  drawEverything();
  moveEverything();
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + PaddleHeight / 2;
  if (ballY > paddle2YCenter + 35) {
    paddle2Y += 5;
  } else if (ballY < paddle2YCenter) {
    paddle2Y -= 5;
  }
}

//Draws Objects
function drawEverything() {
  //background
  colorRect(0, 0, canvas.width, canvas.height, "black");

  //Bails out of the function!
  //If its after background,the background remains!
  if (showingWinScreen) {
    winingLog();
    return;
  }

  //player paddle
  colorRect(0, paddle1Y, PaddleThickness, PaddleHeight, "white");
  //computer paddle
  colorRect(
    canvas.width - PaddleThickness,
    paddle2Y,
    PaddleThickness,
    PaddleHeight,
    "white"
  );
  //circle
  colorCircle(ballX, ballY, 10, "red");

  displayScore();
}

//Move animation
function moveEverything() {
  //Bails out of the function!
  if (showingWinScreen) {
    return;
  }

  computerMovement();
  //Move ball on X
  ballX = ballX + ballSpeedX;
  if (ballX > canvas.width) {
    if (ballY < paddle2Y || ballY > paddle2Y + PaddleHeight) {
      player1Score++; // must be before reset
      ballReset();
    } else {
      ballSpeedX = -ballSpeedX;

      //Vertical speed depending how far from the center you are hiting
      var deltaY = ballY - (paddle2Y + PaddleHeight / 2);
      ballSpeedY = deltaY * 0.35;
    }
  }
  if (ballX < 0) {
    if (ballY < paddle1Y || ballY > paddle1Y + PaddleHeight) {
      player2Score++; // must be before reset
      ballReset();
    } else {
      ballSpeedX = -ballSpeedX;
      
      //Vertical speed depending how far from the center you are hiting
      var deltaY = ballY - (paddle1Y + PaddleHeight / 2);
      ballSpeedY = deltaY * 0.35;
    }
  }

  //Move ball on Y
  ballY = ballY + ballSpeedY;
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

//Object constructor
function colorRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fill();
}

function displayScore() {
  ctx.fillStyle = "white";
  ctx.font = "30px Calibri";
  ctx.fillText("Score: " + player1Score, 100, 100);

  ctx.fillText("Score: " + player2Score, canvas.width - 200, 100);
}

function winingLog() {
  ctx.fillStyle = "orange";
  ctx.fillText("Click to continue!", 100, 100);
}
