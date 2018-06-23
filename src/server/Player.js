import { randomCard } from './data.js'

class Player {
  constructor(id) {
    this.id = id
    this.name = 'Unknown Player'
    this.hp = 1
    this.dead = false

    this.handCards = [randomCard(), randomCard(), randomCard()]

    this.useIdx = null
    this.discardIdx = null
  }

  isReady() {
    return (this.useIdx != null && this.discardIdx != null)
  }

  use(cardIdx) {
    if (cardIdx === this.discardIdx) this.discardIdx = null
    this.useIdx = cardIdx
  }

  discard(cardIdx) {
    if (cardIdx === this.useIdx) this.useIdx = null
    this.discardIdx = cardIdx
  }

}
export default Player
