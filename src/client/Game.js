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
      turnIdx: 0, // TODO: Highlight current player
      started: false, // TODO: Can't use cards until started
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
      this.useCard(turnResult.usedCard)
    })

    this.useCard = this.useCard.bind(this)
    this.animateEvents = this.animateEvents.bind(this)
    this.start = this.start.bind(this)
  }

  useCard(card) {
    card.onUse = () => {} // TODO: Animate card effects
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
  }

  animateEvents() {
    const event = this.events.shift()
    if (event) {

    } else {
      this.setState({players: this.game.players, cards: this.game.cards})
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

        <Players players={this.state.players} cards={this.state.cards}/>

        {instant}
        {startButton}
      </div>
    )
  }
}
export default hot(module)(Game)
