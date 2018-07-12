// @flow

import type { Effect } from '../Card'
import Player from '../Player'
import Game from '../Game'

class Damage implements Effect {
  value = null

  constructor(damage: number) {
    this.value = damage
  }

  type = 'damage'
  shortName = `${this.value ? this.value : '?'} dmg`
  longName = `Deal ${this.value ? this.value : '?'} damage`

  apply = (game: Game, targets: Array<Player>) => {
    if (this.value == null) return
    for (const target of targets) {
      target.hp -= this.value
    }
  }

}

export default Damage
