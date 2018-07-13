// @flow

import Card from './Card'

class Player {
  id: number

  name: string
  hp: number
  handCards: Array<Card>
  boardCards: Array<Card>

  constructor(id: number) {
    this.id = id
    this.name = '?'
    this.hp = 10

    this.handCards = []
    this.boardCards = []
  }

  isDead: () => boolean = () => {
    return this.hp <= 0
  }
}

export default Player
