class Player {
  constructor(id) {
    this.id = id
    this.name = 'Unknown Player'
    this.hp = 10

    this.handCards = []
    this.activeCards = []

    this.useCard = null
    this.discardCard = null
  }
}
export default Player
