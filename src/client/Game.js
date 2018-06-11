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

    this.players = []
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
      this.players = turnResult.game.players
      this.animate(turnResult.events)
    })

    this.start = this.start.bind(this)
    this.animate = this.animate.bind(this)
    this.updatePlayers = this.updatePlayers.bind(this)
  }

  start() {
    this.socket.emit('start game')
  }

  animate(events) {
    if (events[0] && events[0].card.trigger.id === 'instant') {
      this.setState({instant: events[0].card})
    } else {
      this.updatePlayers()
    }
    let i = 0
    while (events[i]) {
      const event = events[i++]

    }
  }

  updatePlayers() {
    console.log(this.players)
    this.setState({players: this.players})
  }

  render() {
    const startButton = this.state.started ? null : (
      <button className={styles.start} onClick={this.start}>
        <span role="img" aria-label="Check Mark">✔</span> Start
      </button>
    )

    const instant = this.state.instant ? (
      <div className={styles.instantLayer}>
        <CardMini card={this.state.instant} instant='true'
          onReady={() => {
            this.setState({instant: null})
          }}
          onUse={() => {
            this.updatePlayers()
          }}
        />
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
