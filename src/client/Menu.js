// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import socketIOClient from 'socket.io-client'
import styles from './Menu.css'
import Button from './comp/Button'
import Game from '../server/Game'

type Props = {
  socket: socketIOClient,
  onHost: (Game) => void,
  onJoin: () => void,
}

class Menu extends React.Component<Props> {
  constructor(props) {
    super(props)

    this.props.socket.on('host game', (game) => {
      this.props.onHost(game.id)
    })
  }

  join: () => void = () => {
    this.props.onJoin()
  }

  host: () => void = () => {
    this.props.socket.emit('host game')
  }

  render() {
    return (
      <div className={styles.box}>
        <div className={styles.title}>Trigger Arena</div>
        <div className={styles.buttons}>
          <Button className={[styles.button, styles.join].join(' ')} color="green" onClick={this.join} tabIndex="1">
            <span role="img" aria-label="Card">🃏</span> Join
          </Button>
          <Button className={[styles.button, styles.host].join(' ')} color="darkturquoise" onClick={this.host}
                  tabIndex="2">
            <span role="img" aria-label="House">🏠</span> Host
          </Button>
        </div>
        <div className={styles.author}>By Nicce</div>
      </div>
    )
  }
}

export default hot(module)(Menu)
