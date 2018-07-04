// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import styles from './Players.css'
import PlayerC from './PlayerC'
import Player from '../server/Player'
import ClientCard from './ClientCard'

const getRow: (Array<Player>, number) => Array<Player> = (players, row) => {
  const firstRowSize = Math.ceil(players.length / 2)
  if (row === 0) {
    return players.slice(0, firstRowSize)
  } else {
    return players.slice(firstRowSize).reverse()
  }
}

type Props = {
  players: Array<Player>,
  cards: Array<ClientCard>,
  turnIdx: number,
}

class Players extends React.Component<Props> {
  render() {
    const cards = []
    let highlightId = null
    for (let i = 0; i < this.props.players.length; i++) {
      cards[i] = this.props.cards.filter(c => c.ownerIdx === i)
      if (i === this.props.turnIdx) highlightId = this.props.players[i].id
    }

    const deadPlayers = this.props.players.filter(p => p.dead)
    const deadPlayersElem = deadPlayers.length > 0 ? (
      <div className={styles.deadPlayers}>
        {deadPlayers.map((player) => (
          <PlayerC key={player.id} player={player} cards={[]} highlight={false} dead={true}/>
        ))}
      </div>
    ) : null

    const livePlayers = this.props.players.filter(p => !p.dead)
    return (
      <div className={styles.players}>
        {[0, 1].map((index) => (
          <div key={index} className={styles.row}>
            {getRow(livePlayers, index).map((player) => (
              <PlayerC key={player.id} player={player} cards={cards[this.props.players.indexOf(player)]}
                       highlight={player.id === highlightId} dead={false}/>
            ))}
          </div>
        ))}
        {deadPlayersElem}
      </div>
    )
  }
}

export default hot(module)(Players)
