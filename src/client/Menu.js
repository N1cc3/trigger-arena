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
        <Button className={[styles.button, styles.join].join(' ')} color="green" onClick={this.join}>
          <span role="img" aria-label="Card">🃏</span> Join
        </Button>
        <Button className={[styles.button, styles.host].join(' ')} color="darkturquoise" onClick={this.host}>
          <span role="img" aria-label="House">🏠</span> Host
        </Button>
      </div>
    )
  }
}
export default hot(module)(Menu)
