import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Game.css'
import Players from './Players'
import CardMini from './CardMini'

class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {
      players: [],
      cards: [],
      instant: null,
      turnIdx: 0,
      started: false,
    }

    this.game = null
    this.events = []
    this.socket = this.props.socket

    this.socket.on('join game', (player) => {
      this.setState((prevState) => {
        prevState.players.push(player)
        return prevState
      })
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
            prevState.cards.find(c => c.number === card.number).cooldown = this.game.cards.find(c => c.number === card.number).cooldown
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
            card.cooldown++
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
        prevState.turnIdx = this.game.turnIdx
        return prevState
      })

    }
  }

  start() {
    this.socket.emit('start game')
  }

  render() {
    const startButton = this.state.started ? null : (
      <button className={styles.start} onClick={this.start}>
        <span role="img" aria-label="Check Mark">✔</span> Start
      </button>
    )

    const instant = this.state.instant ? (
      <div className={styles.instantLayer}>
        <CardMini card={this.state.instant}/>
      </div>
    ) : null

    return (
      <div className={styles.game}>
        Welcome to the game: {('0000' + this.props.gameId).slice(-4)}

        <Players players={this.state.players} cards={this.state.cards} turnIdx={this.state.turnIdx}/>

        {instant}
        {startButton}
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
