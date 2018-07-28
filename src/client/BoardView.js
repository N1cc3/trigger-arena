// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import socketIOClient from 'socket.io-client'
import styles from './BoardView.css'
import Players from './Players'
import CardMini from './CardMini'
import Button from './comp/Button'
import { Howl } from 'howler'
import playerJoinSrc from './sounds/playerJoin.mp3'
import gameStartSrc from './sounds/gameStart.mp3'
import damageSrc from './sounds/damage.mp3'
import healSrc from './sounds/heal.mp3'
import type { Effect } from '../server/Card'
import Instant from '../server/triggers/Instant'
import Heal from '../server/effects/Heal'
import Damage from '../server/effects/Damage'
import type { CardData, EventData, GameData, PlayerData, TurnResultsData } from '../api/Api'

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

type Props = {
  socket: socketIOClient,
  game: GameData,
  onGameOver: () => void,
}

type State = {
  game: GameData,
  instant: ?CardData,
  started: boolean,
  gameOver: boolean,
  winner: ?PlayerData,
}

class BoardView extends React.Component<Props, State> {
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

    this.props.socket.on('next turn', (turnResults: TurnResultsData) => {
      this.game = turnResults.game
      this.events = turnResults.events
      this.animateEvents(turnResults.usedCard)
    })
  }

  animateEvents = (card: ?CardData) => {
    const event: EventData = this.events.shift()

    if (card != null) { // Animate used card

      card.onUse = () => {
        this.setState((prevState) => {
          if (card.trigger.type === 'instant') {
            if (prevState.instant != null) prevState.instant.cooldown++
          } else {
            const card1 = findCard(prevState.game.players, card.id)
            const card2 = findCard(this.game.players, card.id)
            if (card1 != null && card2 != null) card1.cooldown = card2.cooldown + 1
          }
          applyEffect(event.card.effect, prevState.game.players, event.targetIdxs)
          return prevState
        })
      }
      card.onReady = () => {
        this.setState({instant: null})
        this.animateEvents()
      }
      card.triggered = false

      if (card.trigger.type === 'instant') {
        this.setState({instant: card})
      } else {
        this.setState((prevState) => {
          const cardOwner: ?PlayerData = findCardOwner(this.game.players, card.id)
          if (cardOwner != null) {
            const cardOwnerInGame: ?PlayerData = prevState.game.players.find(p => p.id === cardOwner.id)
            if (cardOwnerInGame != null) cardOwnerInGame.boardCards.push(card)
          }
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

    console.log(this.state.instant)
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

export default hot(module)(BoardView)

const applyEffect: (Effect, Array<PlayerData>, Array<number>) => void = (effect, players, targetIdxs) => {
  for (const targetIdx of targetIdxs) {
    const value = effect.value
    if (value == null) continue

    const target = players[targetIdx]

    if (effect.type === Heal.prototype.type) {
      target.hp += value
      heal.play()
    } else if (effect.type === Damage.prototype.type) {
      target.hp -= value
      damage.play()
    }
  }
}

const findCard: (Array<PlayerData>, number) => ?CardData = (players, cardId) => {
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
