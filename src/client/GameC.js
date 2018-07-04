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
import Player from '../server/Player'
import Game from '../server/Game'
import Event from '../server/Event'
import CardAttribute from '../server/CardAttribute'
import ClientCard from './ClientCard'

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
  gameId: number,
  onGameOver: () => void,
}

type State = {
  players: Array<Player>,
  cards: Array<ClientCard>,
  instant: ?ClientCard,
  turnIdx: number,
  started: boolean,
  gameOver: boolean,
  winner: ?Player,
}

class GameC extends React.Component<Props, State> {
  game: ?Game
  events: Array<Event>

  constructor(props) {
    super(props)

    this.state = {
      players: [],
      cards: [],
      instant: null,
      turnIdx: 0,
      started: false,
      gameOver: false,
      winner: null,
    }

    this.game = null
    this.events = []

    this.props.socket.on('join game', (player) => {
      this.setState((prevState) => {
        prevState.players.push(player)
        return prevState
      })
      playerJoin.play()
    })

    this.props.socket.on('change name', (player) => {
      this.setState((prevState) => {
        const p: ?Player = prevState.players.find(p => p.id === player.id)
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
    const event: Event = this.events.shift()

    if (first) { // Animate used card

      const card: ClientCard = new ClientCard(event.card.trigger, event.card.effect, event.card.effect, event.card.rarity)
      card.onUse = () => {
        this.setState((prevState) => {
          if (card.trigger.id === 'instant') {
            if (prevState.instant != null) prevState.instant.cooldown++
          } else {
            const card1: ?ClientCard = prevState.cards.find(c => c.number === card.number)
            const card2: ?ClientCard = this.game != null ? this.game.cards.find(c => c.number === card.number) : null
            if (card1 != null && card2 != null) card1.cooldown = card2.cooldown + 1
          }
          applyEffect(card.effect, prevState.players, event.targetIdxs)
          return prevState
        })
      }
      card.onReady = () => {
        this.setState({instant: null})
        this.animateEvents()
      }
      card.triggered = false
      card.number = event.card.number
      card.ownerIdx = event.card.ownerIdx

      if (card.trigger.id === 'instant') {
        this.setState({instant: card})
      } else {
        this.setState((prevState) => {
          prevState.cards.push(card)
          return prevState
        })
      }

    } else if (event) { // Animate combo or periodic card

      this.setState((prevState) => {
        const card: ?ClientCard = prevState.cards.find(c => c.number === event.card.number)
        if (card == null) return prevState
        card.triggered = true
        card.onUse = () => {
          this.setState((prevState) => {
            applyEffect(card.effect, prevState.players, event.targetIdxs)
            const card2: ?ClientCard = this.game != null ? this.game.cards.find(c => c.number === card.number) : null
            if (card2 != null) card.cooldown = card2.cooldown + 1
            return prevState
          })
        }
        card.onReady = () => {
          this.animateEvents()
        }
        return prevState
      })

    } else { // Event animations complete

      this.setState((prevState) => {
        const game: ?Game = this.game
        if (game != null) {
          prevState.cards = game.cards.map(c => {
            const clientCard = new ClientCard(c.trigger, c.effect, c.effect, c.rarity)
            clientCard.ownerIdx = c.ownerIdx
            clientCard.cooldown = c.cooldown
            clientCard.number = c.number
            return clientCard
          })
          for (const card of prevState.cards) {
            card.triggered = false
          }
          prevState.turnIdx = game.turnIdx
          prevState.gameOver = game.gameOver
          prevState.winner = game.winner
          prevState.players = game.players
        }
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
      <div className={styles.gameId}>Game ID: {('0000' + this.props.gameId).slice(-4)}</div>
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

        <Players players={this.state.players}
                 cards={this.state.cards}
                 turnIdx={this.state.turnIdx}/>

        {instant}
        {startButton}
        {gameOver}
      </div>
    )
  }
}

export default hot(module)(GameC)

const applyEffect: (CardAttribute, Array<Player>, Array<number>) => void = (effect, players, targetIdxs) => {
  for (const targetIdx of targetIdxs) {
    const value = effect.variableValue
    if (value == null) continue
    const target = players[targetIdx]
    switch (effect.id) {
      case 'heal':
        target.hp += value
        heal.play()
        break
      case 'damage':
      default:
        target.hp -= value
        damage.play()
        break
    }
  }
}
