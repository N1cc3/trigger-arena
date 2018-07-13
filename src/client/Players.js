// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import styles from './Players.css'
import PlayerC from './PlayerC'
import type { PlayerData } from './GameC'

const getRow: (Array<PlayerData>, number) => Array<PlayerData> = (players, row) => {
  const firstRowSize = Math.ceil(players.length / 2)
  if (row === 0) {
    return players.slice(0, firstRowSize)
  } else {
    return players.slice(firstRowSize).reverse()
  }
}

type Props = {
  players: Array<PlayerData>,
  turnIdx: number,
}

class Players extends React.Component<Props> {
  render() {
    const highlightId = this.props.players[this.props.turnIdx].id

    const deadPlayers = this.props.players.filter(p => p.dead)
    const livePlayers = this.props.players.filter(p => !p.dead)

    const deadPlayersElem = deadPlayers.length > 0 ? (
      <div className={styles.deadPlayers}>
        {deadPlayers.map((player) => (
          <PlayerC key={player.id} player={player} cards={[]} highlight={false} dead={true}/>
        ))}
      </div>
    ) : null

    return (
      <div className={styles.players}>
        {[0, 1].map((index) => (
          <div key={index} className={styles.row}>
            {getRow(livePlayers, index).map((player) => (
              <PlayerC key={player.id} player={player} highlight={player.id === highlightId} dead={false}/>
            ))}
          </div>
        ))}
        {deadPlayersElem}
      </div>
    )
  }
}

export default hot(module)(Players)
