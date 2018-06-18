import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Name.css'
import Button from './comp/Button'

class Name extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
    }

    this.socket = this.props.socket

    this.socket.on('change name', (player) => {
      if (player.id === this.props.playerId) {
        this.props.onReady()
      }
    })

    this.changeName = this.changeName.bind(this)
    this.ready = this.ready.bind(this)
  }

  changeName(event) {
    const name = event.target.value
    this.setState({name: name})
  }

  ready(e) {
    e.preventDefault()
    this.socket.emit('change name', this.state.name)
  }

  render() {
    return (
      <form className={styles.box} onSubmit={this.ready}>
        <input className={styles.nameInput} type="text" name="name" maxLength="10" required autoFocus autoComplete="on" placeholder="Your name"
        onChange={this.changeName}/>
        <Button className={styles.ready} color="green">Ready</Button>
      </form>
    )
  }
}
export default hot(module)(Name)
