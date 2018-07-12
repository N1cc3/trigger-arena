// @flow

import type { Effect } from '../Card'
import Player from '../Player'
import Game from '../Game'

class Heal implements Effect {
  value = null

  constructor(heal: number) {
    this.value = heal
  }

  type = 'heal'
  shortName = `Heal ${this.value ? this.value : '?'}`
  longName = `Heal ${this.value ? this.value : '?'} hp`

  apply = (game: Game, targets: Array<Player>) => {
    if (this.value == null) return
    for (const target of targets) {
      target.hp += this.value
    }
  }

}

export default Heal
