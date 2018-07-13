import type { Effect, Target, Trigger } from '../server/Card'
import Card from '../server/Card'
import type { TurnResults } from '../server/Game'
import Game, { mod } from '../server/Game'
import Player from '../server/Player'

export type ClientCard = {
  id: number,
  trigger: Trigger,
  effect: Effect,
  target: Target,
  rarity: number,
  cooldown: number,
  onUse: () => void,
  onReady: () => void,
  triggered: boolean,
}

export type EventData = {
  card: Card,
  targetIdxs: Array<number>,
}

export type TurnResultsData = {
  events: Array<EventData>,
  usedCard: Card,
}

export type PlayerData = {
  id: number,
  name: string,
  hp: number,
  dead: boolean,
  boardCards: Array<ClientCard>,
}

export type GameData = {
  id: number,
  players: Array<PlayerData>,
  turnIdx: number,
}

export const cardTransform: (Card, () => void, () => void, boolean) => ClientCard = (card, onUse, onReady, triggered) => {
  return {
    id: card.id,
    trigger: card.trigger,
    effect: card.effect,
    target: card.target,
    rarity: card.rarity,
    cooldown: card.cooldown,
    onUse: onUse,
    onReady: onReady,
    triggered: triggered,
  }
}

export const turnResultsTransform: (Game, TurnResults) => TurnResultsData = (game, turnResults) => {
  const transformed: TurnResultsData = {
    events: [],
    usedCard: turnResults.usedCard,
  }

  for (const event of turnResults.events) {
    const eventC: EventData = {
      card: event.card,
      targetIdxs: [],
    }

    for (const target of event.targets) {
      eventC.targetIdxs.push(game.players.indexOf(target))
    }
  }

  return transformed
}

export const playersTransform: (Array<Player>) => Array<PlayerData> = (players) => {
  return players.map(p => ({
    id: p.id,
    name: p.name,
    hp: p.hp,
    dead: p.isDead(),
    boardCards: p.boardCards.map(c => cardTransform(c, () => {
    }, () => {
    }, false)),
  }))
}

export const gameTransform: (Game) => GameData = (game) => {
  return {
    id: game.id,
    players: playersTransform(game.players),
    turnIdx: mod(game.turn, game.players.length),
  }
}
