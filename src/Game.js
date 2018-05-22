import React, { Component } from 'react'
import styles from './Game.css'

class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {
      players: [],
    }

    this.socket = this.props.socket

    this.socket.on('join game', (data) => {
      let players = this.state.players
      players.push({id: data.playerId, name: data.name})
      this.setState({players: players})
    })

    this.socket.on('change name', (data) => {
      let players = this.state.players
      for (let player of players) {
        if (player.id === data.playerId) {
          player.name = data.name
          break;
        }
      }
      this.setState({players: players})
    })
  }

  render() {
    return (
      <div className={styles.game}>
        Welcome to the game: {('0000' + this.props.gameId).slice(-4)}
        <div>Players:<br/>
          {this.state.players.map((player) => (
            <div key={player.id}>{player.name}</div>
          ))}
        </div>
      </div>
    )
  }
}
export default Game
