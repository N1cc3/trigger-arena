import React, { Component } from 'react'
import styles from './Room.css'

class Room extends Component {
  constructor(props) {
    super(props)

    this.state = {
      room: ''
    }

    this.socket = this.props.socket

    this.socket.on('enter room', (res) => {
      this.props.onEnter()
    })

    this.changeRoom = this.changeRoom.bind(this)
    this.ready = this.ready.bind(this)
  }

  changeRoom(event) {
    let room = event.target.value
    this.setState({room: room})
  }

  ready(e) {
    e.preventDefault()
    this.socket.emit('enter room', this.state.room)
  }

  render() {
    return (
      <form className={styles.box} onSubmit={this.ready}>
        <input className={styles.roomInput} type="text" name="code" pattern="([0-9][0-9][0-9][0-9])" maxLength="4" inputMode="numeric" required autoFocus placeholder="Room code" onChange={this.changeRoom}/>
        <input className={styles.ready} type="submit" value="Enter"/>
      </form>
    )
  }
}
export default Room
