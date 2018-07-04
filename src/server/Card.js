// @flow

import CardAttribute from './CardAttribute'

class Card {
  trigger: CardAttribute
  effect: CardAttribute
  target: CardAttribute
  rarity: number

  cooldown: number
  number: ?number
  ownerIdx: ?number

  constructor(trigger: CardAttribute,
              effect: CardAttribute,
              target: CardAttribute,
              rarity: number) {
    this.trigger = trigger
    this.effect = effect
    this.target = target
    this.rarity = rarity

    this.cooldown = 0
    this.number = null
    this.ownerIdx = null
  }
}

export default Card
