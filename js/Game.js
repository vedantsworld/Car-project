class Game {
  constructor() {
    this.resetButton = createButton("Reset");
    this.leaderboardTitle = createElement('h2');
    this.leader1 = createElement('h2');
    this.leader2 = createElement('h2');
    this.leftKeyActive = false;
    this.playerMoving = false;
    this.blast = false;
  }

  start() {
    player = new Player();
    playerCount = player.getCount()

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100)
    car1.addImage('car1', car1Img);
    car1.addImage('blast', blastImg);
    car1.scale = 0.08

    car2 = createSprite(width / 2 + 50, height - 100)
    car2.addImage('car2', car2Img);
    car2.addImage('blast', blastImg);
    car2.scale = 0.08

    cars = [car1, car2];

    fuelGroup = new Group()
    coinsGroup = new Group()
    obstacleGroup = new Group()

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    this.addSprites(fuelGroup, 5, fuelImg, 0.02)
    this.addSprites(coinsGroup, 20, coinImg, 0.09)
    this.addSprites(obstacleGroup, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions)
  }

  getState() {
    var gameStateRef = database.ref('gameState')
    gameStateRef.on('value', function (data) {
      gameState = data.val();
    })
  }

  updateState(state) {
    database.ref('/').update({
      gameState: state
    })

  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50)
    form.titleImg.class('gameTitleAfterEffect');

    this.resetButton.position(width / 2 + 200, 40);
    this.resetButton.class('resetButton');

    this.leaderboardTitle.html('Leaderboard');
    this.leaderboardTitle.class('leadersText');
    this.leaderboardTitle.position(width / 3 - 60, 40);

    this.leader1.class('leadersText');
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class('leadersText');
    this.leader2.position(width / 3 - 50, 120);

  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref('/').set({
        playerCount: 0,
        gameState: 0,
        carsAtEnd: 0,
        players: {}
      })
      window.location.reload()
    })
  }

  play() {
    this.handleElements();
    this.handleResetButton();
    player.getCarsAtEnd();
    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(trackImg, 0, -height * 5, width, height * 6)

      var index = 0;
      this.showFuelBar()
      this.showLifeBar()
      this.showLeaderBoard()

      for (var plr in allPlayers) {

        index = index + 1
        var x = allPlayers[plr].positionX
        var y = height - allPlayers[plr].positionY

        var currentLife = allPlayers[plr].life;

        if (currentLife <= 0) {
          cars[index - 1].changeImage('blast')
          cars[index - 1].scale = 0.3
          gameState = 2
          this.gameOver()
        }

        cars[index - 1].position.x = x
        cars[index - 1].position.y = y

        if (index == player.index) {
          fill('red')
          ellipse(x, y, 60, 60)

          this.handleObstacleCollision(index);
          this.handleCoins(index);
          this.handleFuel(index);
          this.handleCarCollision(index);
          camera.position.y = cars[index - 1].position.y
        }
      }

      if (gameState == 1) {
        this.handlePlayerControls()
      }

      const finishLine = height * 6 - 100;

      if (player.positionY > finishLine) {
        gameState = 2
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      }

      drawSprites()
    }
  }

  handlePlayerControls() {

    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10
      player.update()
    }

    if (keyIsDown(LEFT_ARROW)) {
      player.positionX -= 10
      player.update()
    }

    if (keyIsDown(RIGHT_ARROW)) {
      player.positionX += 10
      player.update()
    }
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;
      console.log(positions)
      if (positions.length > 0) {
        x = positions[i].x
        y = positions[i].y
        spriteImage = positions[i].image
      }

      else {
        x = random(width / 2 + 150, width / 2 - 150)
        y = random(-height * 5, height - 400)
      }

      var sprite = createSprite(x, y)
      sprite.addImage('sprite', spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite)
    }
  }

  showFuelBar() {
    push();
    image(fuelImg, width / 2 - 130, height - player.positionY - 300, 25, 25);
    fill('white');
    rect(width / 2 - 100, height - player.positionY - 300, 200, 20);
    fill('#FFC400');
    rect(width / 2 - 100, height - player.positionY - 300, player.fuel, 20);
    noStroke();
    pop();
  }

  showLifeBar() {
    push();
    image(lifeImg, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill('white');
    rect(width / 2 - 100, height - player.positionY - 350, 200, 20);
    fill('#BF223A');
    rect(width / 2 - 100, height - player.positionY - 350, player.life, 20);
    noStroke();
    pop();
  }

  handleObstacleCollision(index) {
    if (cars[index - 1].collide(obstacleGroup) && player.life >= 0) {
      player.life -= 5;
    }
  }

  handleCoins(index) {
    cars[index - 1].overlap(coinsGroup), (collector, collected) => {
      player.score += 20
      player.update()
      collected.remove()
    }


  }

  handleFuel(index) {
    player.fuel -= 0.3
    if (player.fuel < 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: 'Oops! You Lost The Race!',
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: '100x100',
      confirmButtonText: 'Thanks For Playing!'
    })
  }

  handleCarCollision(index) {
    if (index == 1) {
      if (cars[index - 1].collide(cars[1]) && player.life > 0) {
        player.life -= 5;

      }
    }
  }

  showRank() {
    swal({
      title: `Awesome! ${player.name}${"\n"}Your Rank Is ${player.rank}`,
      text: 'You Reached The Finish Line Successfully!',
      imageUrl: "https://i.ebayimg.com/images/g/ea8AAOSwr69bQx0n/s-l1600.jpg",
      imageSize: '100x100',
      confirmButtonText: 'Thanks For Playing!'
    })
  }

  showLeaderBoard() {
    var leader1, leader2;
    var players = Object.values(allPlayers)

    if (players[0].rank == 0 && players[1].rank == 0 || players[0].rank == 1) {
      leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;

      leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    }

    if (players[1].rank == 1) {
      leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;

      leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);

  }

}
