import { randomCard } from './data.js'
import Event from './Event'

class Game {
  constructor(id) {
    this.id = id
    this.players = []

    this.turnIdx = 0
    this.cardCount = 0
  }

  nextTurn() {
    const player = this.players[this.turnIdx]
    const cardToUse = player.handCards[player.useIdx]
    const events = []

    // Use card
    if (cardToUse.trigger.id === 'instant') {
      events.push(new Event(player, cardToUse))
    } else {
      cardToUse.number = this.cardCount++
      player.boardCards.push(cardToUse)
    }

    const resolvedAfterInstant = this.resolve(events)

    // New cards
    player.handCards[player.useIdx] = randomCard()
    player.handCards[player.discardIdx] = randomCard()
    player.useIdx = null
    player.discardIdx = null

    this.turnIdx = mod((this.turnIdx + 1), this.players.length)
  }

  resolve(events) {
    let i = 0
    while (events[i]) {
      const event = events[i++]

      // Targets
      const targets = []
      switch (event.card.target.id) {
        case 'everyone':
          for (const player of this.players) {
            targets.push(player)
          }
          break
        case 'random':
          targets.push(this.players[Math.floor(Math.random() * this.players.length)])
          break
        case 'adjacent':
          const playerIdx = this.players.indexOf(event.player)
          const target1 = this.players[mod(playerIdx + 1, this.players.length)]
          const target2 = this.players[mod(playerIdx - 1, this.players.length)]
          if (event.player !== target1) targets.push(target1)
          if (event.player !== target2 && target1 !== target2) targets.push(target2)
          break
        case 'self':
        default:
          targets.push(event.player)
          break
      }

      const addCombos = (target, effectId) => {
        for (const player of this.players) {
          for (const card of player.boardCards) {
            if (card.cooldown > 0) continue

            if (
              (effectId === 'heal'
              && card.trigger.id === 'heals'
              && player === event.player
              && target !== event.player)
              ||
              (effectId === 'heal'
              && card.trigger.id === 'isHealed'
              && target === player)
              ||
              (effectId === 'damage'
              && card.trigger.id === 'dealsDmg'
              && player === event.player
              && target !== event.player)
              ||
              (effectId === 'damage'
              && card.trigger.id === 'takesDmg'
              && target === player)
            ) {
              events.push(new Event(player, card))
              card.cooldown++
            }
          }
        }
      }

      // Effect
      const effect = event.card.effect
      for (const target of targets) {
        switch (effect.id) {
          case 'heal':
            target.hp += effect.variableValue
            break
          case 'damage':
          default:
            target.hp -= effect.variableValue
            break
        }
        addCombos(target, effect.id)
      }

    }

    // Cooldown
    for (const card of this.getBoardCards()) {
      card.cooldown = Math.max(0, card.cooldown - 1)
    }
  }

  getBoardCards() {
    const boardCards = []
    for (const player of this.players) {
      for (const card of player.boardCards) {
        boardCards.push(card)
      }
    }
    return boardCards
  }

  getPeriodicEvents() {
    const periodicEvents = []
    for (const player of this.players) {
      for (const card of player.boardCards) {
        if (card.cooldown > 0) continue
        if (card.trigger.id === 'periodic') {
          periodicEvents.push(new Event(player, card))
        }
      }
    }
    return periodicEvents
  }

}
export default Game

const mod = (n, m) => {
  return ((n % m) + m) % m
}
