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
      started: false,
      turnIdx: 0,
      instant: null,
    }

    this.socket = this.props.socket

    this.socket.on('join game', (player) => {
      const players = this.state.players
      players.push(player)
      this.setState({players: players})
    })

    this.socket.on('change name', (player) => {
      const players = this.state.players
      const p = players.find(p => p.id === player.id)
      if (p) {
        p.name = player.name
        this.setState({players: players})
      }
    })

    this.socket.on('start game', () => {
      this.setState({started: true})
    })

    this.socket.on('next turn', (turnResult) => {
      this.animate(turnResult.events)
    })

    this.start = this.start.bind(this)
  }

  start() {
    this.socket.emit('start game')
  }

  animate(events) {
    let i = 0
    while (events[i]) {
      const event = events[i++]

      if (event.card.trigger.id === 'instant') {
        this.setState({instant: event.card})
      }
    }
  }

  render() {
    const startButton = this.state.started ? null : (
      <button className={styles.start} onClick={this.start}>
        <span role="img" aria-label="Check Mark">✔</span> Start
      </button>
    )

    const instant = this.state.instant ? (
      <div className={styles.instantLayer}>
        <CardMini card={this.state.instant} big='true'/>
      </div>
    ) : null

    return (
      <div className={styles.game}>
        Welcome to the game: {('0000' + this.props.gameId).slice(-4)}
        <Players players={this.state.players}/>

        {instant}
        {startButton}
      </div>
    )
  }
}
export default hot(module)(Game)
