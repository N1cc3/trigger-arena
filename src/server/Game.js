// @flow

import Event from './Event'
import Player from './Player'
import Card from './Card'
import { randomCard } from './CardGenerator'

export type TurnResults = { events: Array<Event>, usedCard: Card }

class Game {
  id: number

  players: Array<Player>
  turn: number

  started: boolean
  animating: boolean

  constructor(id: number) {
    this.id = id

    this.players = []
    this.turn = 0

    this.started = false
    this.animating = false
  }

  nextTurn: (number, number) => TurnResults = (useCardIdx, discardCardIdx) => {
    const playerInTurn: Player = this.getPlayerInTurn()

    const useCard: Card = playerInTurn.handCards[useCardIdx]
    // const discardCard: Card = playerInTurn.handCards[discardCardIdx]

    playerInTurn.handCards[useCardIdx] = this.newCard()
    playerInTurn.handCards[discardCardIdx] = this.newCard()

    const events: Array<Event> = []

    playerInTurn.boardCards.push(useCard)

    // Resolve instant
    const instantEvent = useCard.resolve(this, null, playerInTurn)
    if (instantEvent != null) {
      events.push(instantEvent)
      events.push(...this.resolveAllCombos(instantEvent, playerInTurn))
    }

    // Resolve periodic card
    for (const card of this.getCards()) {
      const cardOwner = this.getCardOwner(card)
      if (cardOwner == null) continue

      const event = card.resolve(this, null, cardOwner)
      if (event == null) continue

      events.push(event)
      events.push(...this.resolveAllCombos(event, cardOwner))
    }

    // Discards
    for (const player of this.players) {
      for (const card of player.boardCards) {
        if (card.shouldBeDiscarded(this)) {
          removeFrom(player.boardCards, card)
        }
      }
    }

    this.turn++

    return { events: events, usedCard: useCard }
  }

  getPlayerInTurn: () => Player = () => {
    return this.players[mod(this.turn, this.players.length)]
  }

  resolveAllCombos: (Event, Player) => Array<Event> = (event, cardOwner) => {
    const events: Array<Event> = [event]
    let i = 0
    while (events[i]) {
      events.push(...this.resolveCombosOneStep(events[i], cardOwner))
      i++
    }
    return events
  }

  resolveCombosOneStep: (Event, Player) => Array<Event> = (event, cardOwner) => {
    const comboEvents: Array<Event> = []
    for (const card of this.getCards()) {
      const comboEvent: ?Event = card.resolve(this, event, cardOwner)
      if (comboEvent != null) comboEvents.push(comboEvent)
    }
    return comboEvents
  }

  getCards: () => Array<Card> = () => {
    let cards = []
    for (const player of this.players) {
      cards = cards.concat(player.boardCards)
    }
    return cards
  }

  getCardOwner: (Card) => ?Player = (card) => {
    for (const player of this.players) {
      if (player.boardCards.includes(card)) return player
    }
    return null
  }

  newCard: () => Card = () => {
    return randomCard(this.getCards().length)
  }

  newPlayer: (number) => Player = (id) => {
    const player = new Player(id)
    player.handCards = [this.newCard(), this.newCard(), this.newCard()]
    this.players.push(player)
    return player
  }
}

export default Game

export const mod: (number, number) => number = (n, m) => {
  return ((n % m) + m) % m
}

const removeFrom: (Array<any>, any) => void = (array, el) => {
  array.splice(array.indexOf(el), 1)
}
