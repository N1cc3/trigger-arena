// @flow

import type { Trigger } from '../Card'
import Card from '../Card'
import Game from '../Game'
import Event from '../Event'

class DamageDealt implements Trigger {
  type = 'damageDealt'
  shortName = 'Dmg dealt'
  longName = 'On damage dealt to other'
  value = null

  isTriggered = (game: Game, card: Card, event: ?Event) => {
    const cardOwner = game.getCardOwner(card)
    return event != null
      && event.card.effect.type === 'damage'
      && event.targets.some(t => t !== cardOwner)
  }

  getInitCooldown = () => 0

  getCooldownAfterTrigger = () => 1

  shouldDiscardCard = () => false
}

export default DamageDealt
