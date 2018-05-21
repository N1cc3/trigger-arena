import React, { Component } from 'react'
import styles from './Name.css'

class Name extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
    }

    this.socket = this.props.socket

    this.socket.on('change name', (res) => {
      if (res.playerId === this.props.playerId) {
        this.props.onReady()
      }
    })

    this.changeName = this.changeName.bind(this)
    this.ready = this.ready.bind(this)
  }

  changeName(event) {
    let name = event.target.value
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
        <input type="submit" value="Ready" className={styles.ready}/>
      </form>
    )
  }
}
export default Name
