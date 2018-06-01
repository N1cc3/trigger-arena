import { randomCard } from './data.js'

class Game {
  constructor(id) {
    this.id = id
    this.players = []

    this.turnIdx = 0
    this.cardCount = 0
  }

  nextTurn() {
    const player = this.players[this.turnIdx]
    const cardToUse = player.handCards[player.useIdx]

    // Use card
    cardToUse.number = this.cardCount++
    player.activeCards.push(cardToUse)

    // New cards
    player.handCards[player.useIdx] = randomCard()
    player.handCards[player.discardIdx] = randomCard()
    player.useIdx = null
    player.discardIdx = null

    this.turnIdx = (this.turnIdx + 1) % this.players.length
  }

}
export default Game
