class Player {
  constructor() {
    this.name = null;
    this.index = 0;
    this.positionX = 0;
    this.positionY = 0;
    this.rank = 0;
    this.score = 0;
    this.fuel = 185;
    this.life = 185;
  }

  getCount() {
    var playerCountRef = database.ref('playerCount')
    playerCountRef.on('value', function (data) {
      playerCount = data.val();
    })

  }

  //Write the player count to the database
  updateCount(count) {
    database.ref('/').update({
      playerCount: count
    })

  }

  update() {
    var playerIndex = 'players/player' + this.index
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      fuel: this.fuel,
      life: this.life,
      score: this.score,
      rank: this.rank
    })
  }

  addPlayer() {
    var playerIndex = 'players/player' + this.index

    if (this.index == 1) {
      this.positionX = width / 2 - 100;
    }
    else {
      this.positionX = width / 2 + 100;
    }

    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score
    })
  }

  //Any method which only class can access is a static method
  static getPlayersInfo() {
    var playersInfoRef = database.ref("players")
    playersInfoRef.on('value', data => {
      allPlayers = data.val()
    })
  }

  getCarsAtEnd() {
    database.ref("carsAtEnd").on('value', data => {
      this.rank = data.val()
    })
  }

  static updateCarsAtEnd(rank) {
    database.ref('/').update({
      carsAtEnd: rank
    })
  }

}
