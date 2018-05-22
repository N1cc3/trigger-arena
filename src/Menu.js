import React, { Component } from 'react'
import styles from './Menu.css'

class Menu extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.socket = this.props.socket

    this.socket.on('host game', (res) => {
      if (res.success) this.props.onHost(res.gameId)
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
        <button className={styles.join} onClick={this.join}>
          <span role="img" aria-label="Card">🃏</span> Join
        </button>
      <button className={styles.host} onClick={this.host}>
        <span role="img" aria-label="House">🏠</span> Host
      </button>
      </div>
    )
  }
}
export default Menu
