// @flow

import type { Trigger } from '../Card'
import Card from '../Card'
import Game from '../Game'
import Event from '../Event'

class HealingTaken implements Trigger {
  type = 'healingTaken'
  getShortName = () => 'Heal taken'
  getLongName = () => 'On healing taken'
  value = null

  isTriggered = (game: Game, card: Card, event: ?Event) => {
    const cardOwner = game.getCardOwner(card)
    return event != null
      && event.card.effect.type === 'heal'
      && event.targets.includes(cardOwner)
  }

  getInitCooldown = () => 0

  getCooldownAfterTrigger = () => 1

  shouldDiscardCard = () => false
}

export default HealingTaken
