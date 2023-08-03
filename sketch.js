var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState;
var cars = [];
var car1, car2;
var car1Img, car2Img;
var allPlayers;
var track;
var trackImg;
var fuelGroup;
var coinsGroup;
var obstacle1Image, obstacle2Image;
var obstacleGroup;
var life;
var lifeImg;
var blastImg;

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1Img = loadImage("./assets/car1.png");
  car2Img = loadImage("./assets/car2.png");
  trackImg = loadImage("./assets/track.jpg");
  coinImg = loadImage("./assets/goldCoin.png");
  fuelImg = loadImage("./assets/fuel.png");
  obstacle1Image = loadImage("./assets/obstacle1.png");
  obstacle2Image = loadImage("./assets/obstacle2.png");
  lifeImg = loadImage("./assets/life.png");
  blastImg = loadImage("./assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);

  if (playerCount == 2) {
    game.updateState(1)
  }

  if (gameState == 1) {
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
