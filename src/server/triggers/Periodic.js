// @flow

import type { Trigger } from '../Card'
import Game from '../Game'
import Event from '../Event'
import Card from '../Card'

class Periodic implements Trigger {
  value = null

  constructor(period: number) {
    this.value = period
  }

  type = 'periodic'
  getShortName = () => `Every ${this.value ? this.value : '?'}. turn`
  getLongName = () => `Every ${this.value ? this.value : '?'}. turn`

  isTriggered = (game: Game, card: Card, event: ?Event) => true

  getInitCooldown = () => this.value != null ? this.value : 0

  getCooldownAfterTrigger = () => this.value != null ? this.value : 0

  shouldDiscardCard = () => false
}

export default Periodic
