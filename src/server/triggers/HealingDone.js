// @flow

import type { Trigger } from '../Card'
import Card from '../Card'
import Game from '../Game'
import Event from '../Event'

class HealingDone implements Trigger {
  type = 'healingDone'
  getShortName = () => 'Heal other'
  getLongName = () => 'On healing done to other'
  value = null

  isTriggered = (game: Game, card: Card, event: ?Event) => {
    const cardOwner = game.getCardOwner(card)
    return event != null
      && event.card.effect.type === 'heal'
      && event.targets.some(t => t !== cardOwner)
  }

  getInitCooldown = () => 0

  getCooldownAfterTrigger = () => 1

  shouldDiscardCard = () => false
}

export default HealingDone
