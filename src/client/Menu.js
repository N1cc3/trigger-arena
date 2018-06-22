import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Menu.css'
import Button from './comp/Button'

class Menu extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.socket = this.props.socket

    this.socket.on('host game', (game) => {
      this.props.onHost(game.id)
    })

    this.join = this.join.bind(this)
    this.host = this.host.bind(this)
  }

  join() {
    this.props.onJoin()
  }

  host() {
    this.socket.emit('host game')
  }

  render() {
    return (
      <div className={styles.box}>
        <div className={styles.title}>Trigger Arena</div>
        <div className={styles.buttons}>
          <Button className={[styles.button, styles.join].join(' ')} color="green" onClick={this.join} tabIndex="1">
            <span role="img" aria-label="Card">🃏</span> Join
          </Button>
          <Button className={[styles.button, styles.host].join(' ')} color="darkturquoise" onClick={this.host} tabIndex="2">
            <span role="img" aria-label="House">🏠</span> Host
          </Button>
        </div>
        <div className={styles.author}>By Nicce</div>
      </div>
    )
  }
}
export default hot(module)(Menu)
