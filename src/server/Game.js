import { randomCard } from './data.js'
import Event from './Event'

class Game {
  constructor(id) {
    this.id = id
    this.players = []
    this.cards = []

    this.turnIdx = 0
    this.cardCount = 0

    this.started = false
  }

  nextTurn() {
    const player = this.players[this.turnIdx]
    const cardToUse = player.handCards[player.useIdx]
    const playerIdx = this.turnIdx
    let events = []
    let instantTargetIdxs = []

    // Use card
    cardToUse.ownerIdx = playerIdx
    instantTargetIdxs = this.resolveTargetIdxs(cardToUse)
    events.push(new Event(cardToUse, instantTargetIdxs))
    if (cardToUse.trigger.id !== 'instant') {
      cardToUse.number = this.cardCount++
      this.cards.push(cardToUse)
    }

    events = this.resolveEvents(events)
    events = events.concat(this.resolveEvents(this.getPeriodicEvents()))

    // Cooldown
    for (const card of this.cards) {
      card.cooldown = Math.max(0, card.cooldown - 1)
    }

    // New cards
    player.handCards[player.useIdx] = randomCard()
    player.handCards[player.discardIdx] = randomCard()
    player.useIdx = null
    player.discardIdx = null

    this.turnIdx = mod((this.turnIdx + 1), this.players.length)

    return events
  }

  resolveEvents(events) {
    let i = 0
    while (events[i]) {
      const event = events[i++]

      // Cooldown
      const trigger = event.card.trigger
      if (trigger.id === 'periodic') {
        event.card.cooldown = trigger.variableValue
      } else if (trigger.id !== 'instant') {
        event.card.cooldown = 1
      }

      // Effect
      const effect = event.card.effect
      for (const targetIdx of event.targetIdxs) {
        const target = this.players[targetIdx]
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
        const combos = this.resolveCombos(targetIdx, effect.id, event.card.ownerIdx)
        events = events.concat(combos)
      }
    }
    return events
  }

  resolveTargetIdxs(card) {
    const playerIdx = card.ownerIdx
    const targetIdxs = []
    switch (card.target.id) {
      case 'everyone':
        for (let i = 0; i < this.players.length; i++) targetIdxs.push(i)
        break
      case 'random':
        targetIdxs.push(Math.floor(Math.random() * this.players.length))
        break
      case 'adjacent':
        const targetIdx1 = mod(playerIdx + 1, this.players.length)
        const targetIdx2 = mod(playerIdx - 1, this.players.length)
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

  resolveCombos(targetIdx, effectId, ownerIdx) {
    const events = []
    for (const card of this.cards) {
      if (card.cooldown > 0) continue
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

  getPeriodicEvents() {
    const events = []
    for (const card of this.cards) {
      if (card.cooldown > 0) continue
      if (card.trigger.id === 'periodic') {
        events.push(new Event(card, this.resolveTargetIdxs(card)))
      }
    }
    return events
  }

}
export default Game

const mod = (n, m) => {
  return ((n % m) + m) % m
}
