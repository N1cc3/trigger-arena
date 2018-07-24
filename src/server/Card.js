// @flow

import Event from './Event'
import Game from './Game'
import Player from './Player'

class Card {
  id: number
  trigger: Trigger
  effect: Effect
  target: Target
  rarity: number

  cooldown: number

  constructor(
    id: number,
    trigger: Trigger,
    effect: Effect,
    target: Target,
    rarity: number,
  ) {
    this.id = id
    this.trigger = trigger
    this.effect = effect
    this.target = target
    this.rarity = rarity

    this.cooldown = trigger.getInitCooldown()
  }

  resolve: (Game, ?Event, Player) => ?Event = (game, lastEvent, cardOwner) => {
    if (this.cooldown === 0 && this.trigger.isTriggered(game, this, lastEvent)) {
      const targets = this.target.resolve(game, cardOwner)
      this.effect.apply(game, targets)
      this.cooldown = this.trigger.getCooldownAfterTrigger()
      return new Event(this, targets)
    } else return null
  }

  shouldBeDiscarded: (Game) => boolean = (game) => {
    return this.trigger.shouldDiscardCard() || this.target.shouldDiscardCard(game)
  }
}

export default Card

export interface CardAttribute {
  type: string;
  getLongName: () => string;
  getShortName: () => string;
  value: ?number;
}

export interface Trigger extends CardAttribute {
  isTriggered: (Game, Card, ?Event) => boolean;
  getInitCooldown: () => number;
  getCooldownAfterTrigger: () => number;
  shouldDiscardCard: () => boolean;
}

export interface Effect extends CardAttribute {
  apply: (Game, Array<Player>) => void;
}

export interface Target extends CardAttribute {
  resolve: (Game, Player) => Array<Player>;
  shouldDiscardCard: (Game) => boolean;
}
