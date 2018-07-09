// @flow

import Card from './Card'
import Player from './Player'

class Event {
  card: Card
  targets: Array<Player>

  constructor(card: Card, targets: Array<Player>) {
    this.card = card
    this.targets = targets
  }
}

export default Event
