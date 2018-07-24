// @flow

import type { Trigger } from '../Card'
import Card from '../Card'
import Game from '../Game'
import Event from '../Event'

class Instant implements Trigger {
  type = 'instant'
  getShortName = () => 'Instant'
  getLongName = () => 'Instant'
  value = null

  isTriggered = (game: Game, card: Card, event: ?Event) => {
    return true
  }

  getInitCooldown = () => 0

  getCooldownAfterTrigger = () => 1

  shouldDiscardCard = () => true
}

export default Instant
