import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Players.css'
import Player from './Player'

const getRow = (players, row) => {
  const firstRowSize = Math.floor(players.length / 2)
  if (row === 0) {
    return players.slice(0, firstRowSize)
  } else {
    return players.slice(firstRowSize)
  }
}

class Players extends Component {
  render() {
    return (
			<div className={styles.players}>
        {[0, 1].map((index) => (
          <div key={index} className={styles.row}>
            {getRow(this.props.players, index).map((player) => (
              <Player key={player.id} name={player.name} hp={player.hp} cards={player.activeCards}/>
            ))}
          </div>
        ))}
			</div>
    )
  }
}
export default hot(module)(Players)
