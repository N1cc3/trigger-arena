import { randomCard } from './data.js'
import Event from './Event'

class Game {
  constructor(id) {
    this.id = id
    this.players = []

    this.turnIdx = 0
    this.cardCount = 0

    this.started = false
  }

  nextTurn() {
    const player = this.players[this.turnIdx]
    const cardToUse = player.handCards[player.useIdx]

    // Use card
    const initialEvents = []
    if (cardToUse.trigger.id === 'instant') {
      const targets = this.resolveTargets(cardToUse, player)
      initialEvents.push(new Event(cardToUse, player, targets))
    } else {
      cardToUse.number = this.cardCount++
      player.boardCards.push(cardToUse)
    }
    const instantEvents = this.resolveEvents(initialEvents)
    const periodicEvents = this.resolveEvents(this.getPeriodicEvents())
    const allEvents = instantEvents.concat(periodicEvents)

    // Cooldown
    for (const card of this.getBoardCards()) {
      card.cooldown = Math.max(0, card.cooldown - 1)
    }

    // New cards
    player.handCards[player.useIdx] = randomCard()
    player.handCards[player.discardIdx] = randomCard()
    player.useIdx = null
    player.discardIdx = null

    this.turnIdx = mod((this.turnIdx + 1), this.players.length)

    return allEvents
  }

  resolveTargets(card, player) {
    const targets = []
    switch (card.target.id) {
      case 'everyone':
        for (const player of this.players) {
          targets.push(player)
        }
        break
      case 'random':
        targets.push(this.players[Math.floor(Math.random() * this.players.length)])
        break
      case 'adjacent':
        const playerIdx = this.players.indexOf(player)
        const target1 = this.players[mod(playerIdx + 1, this.players.length)]
        const target2 = this.players[mod(playerIdx - 1, this.players.length)]
        if (player !== target1) targets.push(target1)
        if (player !== target2 && target1 !== target2) targets.push(target2)
        break
      case 'self':
      default:
        targets.push(player)
        break
    }
    return targets
  }

  resolveCombos(target, effectId, cardOwner) {
    const events = []
    for (const player of this.players) {
      for (const card of player.boardCards) {
        if (card.cooldown > 0) continue
        if (
          (effectId === 'heal'
          && card.trigger.id === 'heals'
          && player === cardOwner
          && target !== cardOwner)
          ||
          (effectId === 'heal'
          && card.trigger.id === 'isHealed'
          && target === player)
          ||
          (effectId === 'damage'
          && card.trigger.id === 'dealsDmg'
          && player === cardOwner
          && target !== cardOwner)
          ||
          (effectId === 'damage'
          && card.trigger.id === 'takesDmg'
          && target === player)
        ) {
          events.push(new Event(card, player, this.resolveTargets(card, player)))
        }
      }
    }
    return events
  }

  resolveEvents(events) {
    let i = 0
    while (events[i]) {
      const event = events[i++]

      // Cooldown
      if (event.card.trigger.id === 'periodic') {
        event.card.cooldown += event.card.trigger.variableValue
      } else {
        event.card.cooldown++
      }

      // Effect
      const effect = event.card.effect
      console.log(event)
      for (const target of event.targets) {
        switch (effect.id) {
          case 'heal':
            target.hp += effect.variableValue
            break
          case 'damage':
          default:
            target.hp -= effect.variableValue
            break
        }

        // Combos
        const combos = this.resolveCombos(target, effect.id, event.player)
        for (const comboEvent of combos) {
          events.push(comboEvent)
        }
      }

    }

    return events
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
    const events = []
    for (const player of this.players) {
      for (const card of player.boardCards) {
        if (card.cooldown > 0) continue
        if (card.trigger.id === 'periodic') {
          events.push(new Event(card, player, this.resolveTargets(card, player)))
        }
      }
    }
    return events
  }

}
export default Game

const mod = (n, m) => {
  return ((n % m) + m) % m
}
