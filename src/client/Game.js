import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Game.css'
import Players from './Players'
import CardMini from './CardMini'
import Button from './comp/Button'
import { Howl } from 'howler'
import playerJoinSrc from './sounds/playerJoin.mp3'

const playerJoin = new Howl({
  src: [playerJoinSrc],
})

class Game extends Component {
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
    this.socket = this.props.socket

    this.socket.on('join game', (player) => {
      this.setState((prevState) => {
        prevState.players.push(player)
        return prevState
      })
      playerJoin.play()
    })

    this.socket.on('change name', (player) => {
      this.setState((prevState) => {
        const p = prevState.players.find(p => p.id === player.id)
        if (p) p.name = player.name
        return prevState
      })
    })

    this.socket.on('start game', () => {
      this.setState({started: true})
    })

    this.socket.on('next turn', (turnResult) => {
      this.game = turnResult.game
      this.events = turnResult.events
      this.animateEvents(this.events.length > 0)
    })

    this.animateEvents = this.animateEvents.bind(this)
    this.start = this.start.bind(this)
  }

  animateEvents(first = false) {
    const event = this.events.shift()

    if (first) { // Animate used card

      const card = event.card
      card.onUse = () => {
        this.setState((prevState) => {
          if (card.trigger.id === 'instant') {
            prevState.instant.cooldown++
          } else {
            prevState.cards.find(c => c.number === card.number).cooldown = this.game.cards.find(c => c.number === card.number).cooldown + 1
          }
          applyEffect(card.effect, prevState.players, event.targetIdxs)
          return prevState
        })
      }
      card.onReady = () => {
        this.setState({instant: null})
        this.animateEvents()
      }

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
        const card = prevState.cards.find(c => c.number === event.card.number)
        card.triggered = true
        card.onUse = () => {
          this.setState((prevState) => {
            applyEffect(card.effect, prevState.players, event.targetIdxs)
            card.cooldown = this.game.cards.find(c => c.number === card.number).cooldown + 1
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
        for (const card of prevState.cards) {
          card.triggered = false
          card.cooldown = this.game.cards.find(c => c.number === card.number).cooldown
        }
        for (const player of prevState.players) {
          player.dead = this.game.players.find(p => p.id === player.id).dead
        }
        prevState.turnIdx = this.game.turnIdx
        prevState.gameOver = this.game.gameOver
        prevState.winner = this.game.winner
        return prevState
      })

      if (this.state.gameOver) {
        this.props.onGameOver()
      }
      this.socket.emit('next turn')

    }
  }

  start() {
    this.socket.emit('start game')
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

        <Players players={this.state.players} cards={this.state.cards} turnIdx={this.state.turnIdx}/>

        {instant}
        {startButton}
        {gameOver}
      </div>
    )
  }
}
export default hot(module)(Game)

const applyEffect = (effect, players, targetIdxs) => {
  for (const targetIdx of targetIdxs) {
    const target = players[targetIdx]
    switch (effect.id) {
      case 'heal':
        target.hp += effect.variableValue
        break
      case 'damage':
      default:
        target.hp -= effect.variableValue
        break
    }
  }
}
