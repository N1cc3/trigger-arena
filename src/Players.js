import React, { Component } from 'react'
import styles from './Players.css'
import Player from './Player'

const getRow = (players, row) => {
  let firstRowSize = Math.floor(players.length / 2)
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
        <div className={styles.row}>
          {getRow(this.props.players, 0).map((player) => (
            <Player key={player.id} name={player.name}/>
          ))}
        </div>
        <div className={styles.row}>
          {getRow(this.props.players, 1).map((player) => (
            <Player key={player.id} name={player.name}/>
          ))}
        </div>
			</div>
    )
  }
}
export default Players
