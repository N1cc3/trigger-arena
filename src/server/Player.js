// @flow

import { randomCard } from './data.js'
import Card from './Card'

type CardIdx = null | 0 | 1 | 2

class Player {
  id: number

  name: string
  hp: number
  dead: boolean
  handCards: Array<Card>
  useIdx: CardIdx
  discardIdx: CardIdx

  constructor(id: number) {
    this.id = id
    this.name = 'Unknown Player'
    this.hp = 10
    this.dead = false

    this.handCards = [randomCard(), randomCard(), randomCard()]

    this.useIdx = null
    this.discardIdx = null
  }

  isReady() {
    return (this.useIdx != null && this.discardIdx != null)
  }

  use(cardIdx: CardIdx) {
    if (cardIdx === this.discardIdx) this.discardIdx = null
    this.useIdx = cardIdx
  }

  discard(cardIdx: CardIdx) {
    if (cardIdx === this.useIdx) this.useIdx = null
    this.discardIdx = cardIdx
  }

}

export default Player
