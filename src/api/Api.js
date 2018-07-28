import Card from '../server/Card'
import type { TurnResults } from '../server/Game'
import Game, { mod } from '../server/Game'
import Player from '../server/Player'
import type { CardAttribute } from '../server/Card'


export type CardAttributeData = {
  type: string,
  longName: string,
  shortName: string,
  value: ?number,
}

export type CardData = {
  id: number,
  trigger: CardAttributeData,
  effect: CardAttributeData,
  target: CardAttributeData,
  rarity: number,
  cooldown: number,
  onUse: () => void,
  onReady: () => void,
  triggered: boolean,
}

export type EventData = {
  card: CardData,
  targetIdxs: Array<number>,
}

export type TurnResultsData = {
  events: Array<EventData>,
  usedCard: CardData,
}

export type PlayerData = {
  id: number,
  name: string,
  hp: number,
  dead: boolean,
  boardCards: Array<CardData>,
}

export type GameData = {
  id: number,
  players: Array<PlayerData>,
  turnIdx: number,
}

export const cardAttributeTransform: (CardAttribute) => CardAttributeData = (cardAttr) => {
  return {
    type: cardAttr.type,
    longName: cardAttr.getLongName(),
    shortName: cardAttr.getShortName(),
    value: cardAttr.value,
  }
}

export const cardTransform: (Card, () => void, () => void, boolean) => CardData = (card, onUse, onReady, triggered) => {
  return {
    id: card.id,
    trigger: cardAttributeTransform(card.trigger),
    effect: cardAttributeTransform(card.effect),
    target: cardAttributeTransform(card.target),
    rarity: card.rarity,
    cooldown: card.cooldown,
    onUse: onUse,
    onReady: onReady,
    triggered: triggered,
  }
}

export const targetsTransform: (Array<Player>, Game) => Array<number> = (targets, game) => {
  return targets.map(t => game.players.indexOf(t))
}

export const eventTransform: (Event, Game) => EventData = (event, game) => {
  return {
    card: cardTransform(event.card),
    targetIdxs: targetsTransform(event.targets, game),
  }
}

export const turnResultsTransform: (Game, TurnResults) => TurnResultsData = (game, turnResults) => {
  return {
    events: turnResults.events.map(e => eventTransform(e, game)),
    usedCard: cardTransform(turnResults.usedCard, ()=>{}, ()=>{}, false),
  }
}

export const playersTransform: (Array<Player>) => Array<PlayerData> = (players) => {
  return players.map(p => ({
    id: p.id,
    name: p.name,
    hp: p.hp,
    dead: p.isDead(),
    boardCards: p.boardCards.map(c => cardTransform(c))
  }))
}

export const gameTransform: (Game) => GameData = (game) => {
  return {
    id: game.id,
    players: playersTransform(game.players),
    turnIdx: mod(game.turn, game.players.length),
  }
}
