import { randomCard } from './data.js'

class Player {
  constructor(id) {
    this.id = id
    this.name = 'Unknown Player'
    this.hp = 10

    this.handCards = [randomCard(), randomCard(), randomCard()]
    this.activeCards = []

    this.useIdx = null
    this.discardIdx = null
  }

  isReady() {
    return (this.useIdx != null && this.discardIdx != null)
  }
}
export default Player
