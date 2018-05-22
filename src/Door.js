import React, { Component } from 'react'
import styles from './Door.css'

class Door extends Component {
  constructor(props) {
    super(props)

    this.state = {
      gameId: ''
    }

    this.socket = this.props.socket

    this.socket.on('join game', (res) => {
      if (res.success) this.props.onJoin(res.gameId)
    })

    this.changeGameId = this.changeGameId.bind(this)
    this.ready = this.ready.bind(this)
  }

  changeGameId(event) {
    let gameId = event.target.value
    this.setState({gameId: gameId})
  }

  ready(e) {
    e.preventDefault()
    this.socket.emit('join game', this.state.gameId)
  }

  render() {
    return (
      <form className={styles.box} onSubmit={this.ready}>
        <input className={styles.gameIdInput} type="text" name="code" pattern="([0-9][0-9][0-9][0-9])" maxLength="4" inputMode="numeric" required autoFocus placeholder="Game ID" onChange={this.changeGameId}/>
        <input className={styles.ready} type="submit" value="Enter"/>
      </form>
    )
  }
}
export default Door
