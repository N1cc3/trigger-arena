import { randomCard } from './data.js'

class Game {
  constructor(id) {
    this.id = id
    this.players = []

    this.cardCount = 0
  }

  newCard() {
    return randomCard()
  }
}
export default Game
