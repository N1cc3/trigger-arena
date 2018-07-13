// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import socketIOClient from 'socket.io-client'
import styles from './GameC.css'
import Players from './Players'
import CardMini from './CardMini'
import Button from './comp/Button'
import { Howl } from 'howler'
import playerJoinSrc from './sounds/playerJoin.mp3'
import gameStartSrc from './sounds/gameStart.mp3'
import damageSrc from './sounds/damage.mp3'
import healSrc from './sounds/heal.mp3'
import type { Effect, Target, Trigger } from '../server/Card'
import Card from '../server/Card'
import Instant from '../server/triggers/Instant'
import Heal from '../server/effects/Heal'
import Damage from '../server/effects/Damage'

const playerJoin = new Howl({
  src: [playerJoinSrc],
})

const gameStart = new Howl({
  src: [gameStartSrc],
})

const damage = new Howl({
  src: [damageSrc],
})

const heal = new Howl({
  src: [healSrc],
})

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
type Props = {
  socket: socketIOClient,
  game: GameData,
  onGameOver: () => void,
}

type State = {
  game: GameData,
  instant: ?ClientCard,
  started: boolean,
  gameOver: boolean,
  winner: ?PlayerData,
}

class GameC extends React.Component<Props, State> {
  game: GameData
  events: Array<EventData>

  constructor(props) {
    super(props)

    this.state = {
      game: this.props.game,
      instant: null,
      started: false,
      gameOver: false,
      winner: null,
    }

    this.game = this.props.game
    this.events = []

    this.props.socket.on('join game', (player) => {
      this.setState((prevState) => {
        prevState.game.players.push(player)
        return prevState
      })
      playerJoin.play()
    })

    this.props.socket.on('change name', (player) => {
      this.setState((prevState) => {
        const p: ?PlayerData = prevState.game.players.find(p => p.id === player.id)
        if (p) p.name = player.name
        return prevState
      })
    })

    this.props.socket.on('start game', () => {
      this.setState({started: true})
      gameStart.play()
    })

    this.props.socket.on('next turn', (turnResult) => {
      this.game = turnResult.game
      this.events = turnResult.events
      this.animateEvents(this.events.length > 0)
    })
  }

  animateEvents = (first: boolean = false) => {
    const event: EventData = this.events.shift()

    if (first) { // Animate used card

      const card = cardTransform(
        event.card,
        () => {
          this.setState((prevState) => {
            if (event.card.trigger instanceof Instant) {
              if (prevState.instant != null) prevState.instant.cooldown++
            } else {
              const card1 = findCard(prevState.game.players, card.id)
              const card2 = findCard(this.game.players, card.id)
              if (card1 != null && card2 != null) card1.cooldown = card2.cooldown + 1
            }
            applyEffect(event.card.effect, prevState.game.players, event.targetIdxs)
            return prevState
          })
        },
        () => {
          this.setState({instant: null})
          this.animateEvents()
        },
        false,
      )

      if (card.trigger instanceof Instant) {
        this.setState({instant: card})
      } else {
        this.setState((prevState) => {
          const cardOwner = findCardOwner(prevState.game.players, card.id)
          if (cardOwner != null) cardOwner.boardCards.push(card)
          return prevState
        })
      }

    } else if (event) { // Animate combo or periodic card

      this.setState((prevState) => {
        const card = findCard(prevState.game.players, event.card.id)
        if (card != null) {
          card.triggered = true
          card.onUse = () => {
            this.setState((prevState) => {
              applyEffect(card.effect, prevState.game.players, event.targetIdxs)
              const card2 = findCard(this.game.players, card.id)
              if (card2 != null) card.cooldown = card2.cooldown + 1
              return prevState
            })
          }
          card.onReady = () => {
            this.animateEvents()
          }
        }
        return prevState
      })

    } else { // Event animations complete

      this.setState((prevState) => {
        // prevState.gameOver = game.gameOver
        // prevState.winner = game.winner
        prevState.game = this.game
        return prevState
      })

      if (this.state.gameOver) {
        this.props.onGameOver()
      }
      this.props.socket.emit('next turn')

    }
  }

  start: () => void = () => {
    this.props.socket.emit('start game')
  }

  render() {
    const gameId = !this.state.started ? (
      <div className={styles.gameId}>Game ID: {('0000' + this.props.game.id).slice(-4)}</div>
    ) : null

    const startButton = this.state.started ? null : (
      <Button className={styles.start} color="green" onClick={this.start} tabIndex="1">
        <span role="img" aria-label="Check Mark">✔</span> Start
      </Button>
    )

    const instant = this.state.instant ? (
      <div className={styles.instantLayer}>
        <CardMini card={this.state.instant}/>
      </div>
    ) : null

    const gameOver = this.state.gameOver ? (
      <div className={styles.gameOver}>
        Game Over!
        {this.state.winner ? <div>Winner: {this.state.winner.name}</div> : <div>Draw!</div>}
      </div>
    ) : null

    return (
      <div className={styles.game}>
        {gameId}

        <Players players={this.state.game.players}
                 turnIdx={this.state.game.turnIdx}/>

        {instant}
        {startButton}
        {gameOver}
      </div>
    )
  }
}

export default hot(module)(GameC)

const applyEffect: (Effect, Array<PlayerData>, Array<number>) => void = (effect, players, targetIdxs) => {
  for (const targetIdx of targetIdxs) {
    const value = effect.value
    if (value == null) continue

    const target = players[targetIdx]

    if (effect instanceof Heal) {
      target.hp += value
      heal.play()
    } else if (effect instanceof Damage) {
      target.hp -= value
      damage.play()
    }
  }
}

const findCard: (Array<PlayerData>, number) => ?ClientCard = (players, cardId) => {
  for (const player of players) {
    const card = player.boardCards.find(c => c.id === cardId)
    if (card != null) return card
  }
}

const findCardOwner: (Array<PlayerData>, number) => ?PlayerData = (players, cardId) => {
  for (const player of players) {
    const card = player.boardCards.find(c => c.id === cardId)
    if (card != null) return player
  }
}
