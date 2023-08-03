class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Enter your name");
    this.playButton = createButton("Play");
    this.titleImg = createImg("./assets/title.png", "game title");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  setElementPosition() {
    this.titleImg.position(120, 160)
    this.input.position(width / 2 - 120, height / 2)
    this.playButton.position(width / 2 - 110, height / 2 + 75)
    this.greeting.position(width / 2 - 300, height / 2 - 100)
  }

  setElementStyle() {
    this.playButton.class('customButton')
    this.titleImg.class('gameTitle')
    this.input.class('customInput')
    this.greeting.class('greeting')
  }

  handleMousePressed() {
    this.playButton.mousePressed(() => {
      this.input.hide()
      this.playButton.hide()
      //`` are used to create a variable inside the string 
      var message = `Hello ${this.input.value()}
      </br> Wait for another player to join ...
      `
      this.greeting.html(message)
      playerCount += 1
      player.name = this.input.value()
      player.index = playerCount;
      player.updateCount(playerCount)
      player.addPlayer();
    })
  }

  display() {
    this.setElementPosition();
    this.setElementStyle();
    this.handleMousePressed();
  }

}
