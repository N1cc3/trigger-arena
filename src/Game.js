import React, { Component } from 'react'
import styles from './Game.css'

class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.socket = this.props.socket
  }

  render() {
    return (
      <div className={styles.game}>
        Welcome to the game: {('0000' + this.props.gameId).slice(-4)}
      </div>
    )
  }
}
export default Game
