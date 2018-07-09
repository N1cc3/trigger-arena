// @flow

import Event from './Event'
import Player from './Player'
import Card from './Card'

class Game {
  id: number

  players: Array<Player>
  turn: number

  constructor(id: number) {
    this.id = id

    this.players = []
    this.turn = 0
  }

  nextTurn: (Card, Card) => Array<Event> = (useCard: Card, discardCard: Card) => {
    const playerInTurn: Player = this.getPlayerInTurn()
    const events: Array<Event> = []

    playerInTurn.boardCards.push(useCard)

    // Resolve instant
    const instantEvent = useCard.resolve(this, null, playerInTurn)
    if (instantEvent != null) {
      events.push(instantEvent)
      events.push(...this.resolveAllCombos(instantEvent, playerInTurn))

      if (useCard.shouldBeDiscarded(this)) {
        removeFrom(playerInTurn.boardCards, useCard)
      }
    }

    // TODO: Check all cards for triggers (i.e. periodics)

    return events
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
}

export default Game

const mod: (number, number) => number = (n, m) => {
  return ((n % m) + m) % m
}

const removeFrom: (Array<any>, any) => void = (array, el) => {
  array.splice(array.indexOf(el), 1)
}
