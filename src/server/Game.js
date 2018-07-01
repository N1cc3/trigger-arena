// @flow

import { randomCard } from './data.js'
import Event from './Event'
import Player from './Player'
import Card from './Card'

class Game {
  id: number

  players: Array<Player>
  cards: Array<Card>
  turnIdx: number
  cardCount: number
  started: boolean
  animating: boolean
  gameOver: boolean
  winner: ?Player

  constructor(id: number) {
    this.id = id

    this.players = []
    this.cards = []

    this.turnIdx = 0
    this.cardCount = 0

    this.started = false
    this.animating = false
    this.gameOver = false
    this.winner = null
  }

  nextTurn: () => Array<Event> = () => {
    const player: Player = this.players[this.turnIdx]
    const cardToUse: Card = player.handCards[player.useIdx ? player.useIdx : 0]
    let events: Array<Event> = []

    // Use card
    cardToUse.ownerIdx = this.turnIdx
    const instantTargetIdxs = this.resolveTargetIdxs(cardToUse)
    events.push(new Event(cardToUse, instantTargetIdxs))
    if (cardToUse.trigger.id === 'instant') {
      events = this.resolveEvents(events)
    } else {
      cardToUse.number = this.cardCount++
      this.cards.push(cardToUse)
      if (cardToUse.trigger.id === 'periodic' && cardToUse.trigger.variableValue != null) {
        cardToUse.cooldown = cardToUse.trigger.variableValue // Start with cooldown
      }
    }

    events = events.concat(this.resolveEvents(this.getPeriodicEvents()))

    // Dead players
    for (const p of this.players) {
      if (p.hp <= 0) {
        p.dead = true
      }
    }

    // Win conditions
    if (this.players.filter(p => !p.dead).length === 1) {
      this.gameOver = true
      this.winner = this.players.find(p => !p.dead)
    } else if (this.players.filter(p => !p.dead).length === 0) {
      this.gameOver = true
    }

    if (!this.gameOver) {

      // Cooldown
      for (const card of this.cards) {
        if (card.ownerIdx != null && this.players[card.ownerIdx]
          && !this.players[card.ownerIdx].dead) card.cooldown = Math.max(0, card.cooldown - 1)
      }

      // New cards
      const useIdx = player.useIdx
      if (useIdx != null) {
        player.handCards[useIdx] = randomCard()
        player.useIdx = null
      }
      const discardIdx = player.discardIdx
      if (discardIdx != null) {
        player.handCards[discardIdx] = randomCard()
        player.discardIdx = null
      }

      this.turnIdx = mod((this.turnIdx + 1), this.players.length)
      while (this.players[this.turnIdx].dead) {
        this.turnIdx = mod((this.turnIdx + 1), this.players.length)
      }

    }

    return events
  }

  resolveEvents: (Array<Event>) => Array<Event> = (events) => {
    let i = 0
    while (events[i]) {
      const event = events[i++]

      if (event.card.ownerIdx == null || this.players[event.card.ownerIdx].dead) continue

      // Cooldown
      const trigger = event.card.trigger
      if (trigger.id === 'periodic' && trigger.variableValue != null) {
        event.card.cooldown = trigger.variableValue
      } else if (trigger.id !== 'instant') {
        event.card.cooldown = 1
      }

      // Effect
      const effect = event.card.effect
      for (const targetIdx of event.targetIdxs) {
        const value = effect.variableValue
        if (value == null) continue
        const target = this.players[targetIdx]
        switch (effect.id) {
          case 'heal':
            target.hp += value
            break
          case 'damage':
          default:
            target.hp -= value
            break
        }

        // Combos
        const ownerIdx = event.card.ownerIdx
        if (ownerIdx == null) continue
        const combos = this.resolveCombos(targetIdx, effect.id, ownerIdx)
        events = events.concat(combos)
      }
    }
    return events
  }

  resolveTargetIdxs: (Card) => Array<number> = (card) => {
    if (card.ownerIdx == null) return []
    const playerIdx = card.ownerIdx
    const targetIdxs = []
    switch (card.target.id) {
      case 'everyone':
        for (let i = 0; i < this.players.length; i++) if (!this.players[i].dead) targetIdxs.push(i)
        break
      case 'random':
        let targetIdx = Math.floor(Math.random() * this.players.length)
        while (this.players[targetIdx].dead) {
          targetIdx = Math.floor(Math.random() * this.players.length)
        }
        targetIdxs.push(targetIdx)
        break
      case 'adjacent':
        let targetIdx1 = mod(playerIdx + 1, this.players.length)
        while (this.players[targetIdx1].dead) {
          targetIdx1 = mod(targetIdx1 + 1, this.players.length)
        }
        let targetIdx2 = mod(playerIdx - 1, this.players.length)
        while (this.players[targetIdx2].dead) {
          targetIdx2 = mod(targetIdx2 - 1, this.players.length)
        }
        if (playerIdx !== targetIdx1) targetIdxs.push(targetIdx1)
        if (playerIdx !== targetIdx2
          && targetIdx1 !== targetIdx2) targetIdxs.push(targetIdx2)
        break
      case 'self':
      default:
        targetIdxs.push(playerIdx)
        break
    }
    return targetIdxs
  }

  resolveCombos: (number, string, number) => Array<Event> = (targetIdx, effectId, ownerIdx) => {
    const events = []
    for (const card of this.cards) {
      if (card.cooldown > 0) continue
      if (this.players[targetIdx].dead) continue
      if (
        (effectId === 'heal'
          && card.trigger.id === 'heals'
          && card.ownerIdx === ownerIdx
          && targetIdx !== ownerIdx)
        ||
        (effectId === 'heal'
          && card.trigger.id === 'isHealed'
          && targetIdx === card.ownerIdx)
        ||
        (effectId === 'damage'
          && card.trigger.id === 'dealsDmg'
          && card.ownerIdx === ownerIdx
          && targetIdx !== ownerIdx)
        ||
        (effectId === 'damage'
          && card.trigger.id === 'takesDmg'
          && targetIdx === card.ownerIdx)
      ) {
        card.cooldown = 1
        events.push(new Event(card, this.resolveTargetIdxs(card)))
      }
    }
    return events
  }

  getPeriodicEvents: () => Array<Event> = () => {
    const events = []
    for (const card of this.cards) {
      if (card.cooldown > 0) continue
      if (card.ownerIdx == null || this.players[card.ownerIdx].dead) continue
      if (card.trigger.id === 'periodic') {
        events.push(new Event(card, this.resolveTargetIdxs(card)))
      }
    }
    return events
  }

}

export default Game

const mod: (number, number) => number = (n, m) => {
  return ((n % m) + m) % m
}
