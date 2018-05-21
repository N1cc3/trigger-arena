import React, { Component } from 'react'
import styles from './Menu.css'

class Menu extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.socket = this.props.socket

    this.socket.on('join', (cards) => {

    })

    this.socket.on('host', (cards) => {

    })

    this.join = this.join.bind(this)
    this.host = this.host.bind(this)
  }

  join() {
    this.props.onJoin()
  }

  host() {

  }

  render() {
    return (
      <div className={styles.box}>
        <button className={styles.join} onClick={this.join}>Join</button>
      <button className={styles.host} onClick={this.host}>Host</button>
      </div>
    )
  }
}
export default Menu
