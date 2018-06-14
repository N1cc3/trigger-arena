import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Players.css'
import Player from './Player'

const getRow = (players, row) => {
  const firstRowSize = Math.ceil(players.length / 2)
  if (row === 0) {
    return players.slice(0, firstRowSize)
  } else {
    return players.slice(firstRowSize)
  }
}

class Players extends Component {
  render() {
    const cards = []
    let highlightId = null
    for (let i = 0; i < this.props.players.length; i++) {
      cards[i] = this.props.cards.filter(c => c.ownerIdx === i)
      if (i === this.props.turnIdx) highlightId = this.props.players[i].id
    }
    return (
			<div className={styles.players}>
        {[0, 1].map((index) => (
          <div key={index} className={styles.row}>
            {getRow(this.props.players, index).map((player) => (
              <Player key={player.id} player={player} cards={cards[this.props.players.indexOf(player)]} highlight={player.id === highlightId}/>
            ))}
          </div>
        ))}
			</div>
    )
  }
}
export default hot(module)(Players)
