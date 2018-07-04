// @flow

import Card from './Card'

class Event {
  card: Card
  targetIdxs: Array<number>

  constructor(card: Card, targetIdxs: Array<number>) {
    this.card = card
    this.targetIdxs = targetIdxs
  }
}

export default Event
