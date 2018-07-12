// @flow

import type { Trigger } from '../Card'
import Card from '../Card'
import Game from '../Game'
import Event from '../Event'

class DamageTaken implements Trigger {
  type = 'damageTaken'
  shortName = 'Dmg taken'
  longName = 'On damage taken'
  value = null

  isTriggered = (game: Game, card: Card, event: ?Event) => {
    const cardOwner = game.getCardOwner(card)
    return event != null
      && event.card.effect.type === 'damage'
      && event.targets.includes(cardOwner)
  }

  getInitCooldown = () => 0

  getCooldownAfterTrigger = () => 1

  shouldDiscardCard = () => false
}

export default DamageTaken
