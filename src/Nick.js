import React, { Component } from 'react'
import styles from './Nick.css'

class Nick extends Component {
  constructor(props) {
    super(props)

    this.state = {
      nick: '',
    }

    this.socket = this.props.socket

    this.socket.on('change nick', (res) => {
      if (res.playerId === this.props.playerId) {
        this.props.onReady()
      }
    })

    this.changeNick = this.changeNick.bind(this)
    this.ready = this.ready.bind(this)
  }

  changeNick(event) {
    let nick = event.target.value
    this.setState({nick: nick})
  }

  ready(e) {
    e.preventDefault()
    this.socket.emit('change nick', this.state.nick)
  }

  render() {
    return (
      <form className={styles.box} onSubmit={this.ready}>
        <input className={styles.nickInput} type="text" name="nick" maxLength="10" required autoFocus autoComplete="on" placeholder="Your nick"
        onChange={this.changeNick}/>
        <input type="submit" value="Ready" className={styles.ready}/>
      </form>
    )
  }
}
export default Nick
