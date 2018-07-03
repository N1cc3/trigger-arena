// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import styles from './Name.css'
import Button from './comp/Button'
import socketIOClient from 'socket.io-client'

type Props = {
  socket: socketIOClient,
  playerId: number,
  onReady: () => void,
}

type State = {
  name: string,
}

class Name extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
    }

    this.props.socket.on('change name', (player) => {
      if (player.id === this.props.playerId) {
        this.props.onReady()
      }
    })
  }

  changeName: (SyntheticInputEvent<HTMLInputElement>) => void = (e) => {
    const name = e.target.value
    this.setState({name: name})
  }

  ready: () => void = () => {
    this.props.socket.emit('change name', this.state.name)
  }

  render() {
    return (
      <form className={styles.box} onSubmit={this.ready}>
        <input className={styles.nameInput} type="text" name="name"
               maxLength="10" required autoFocus autoComplete="on"
               placeholder="Your name" onChange={this.changeName}/>
        <Button className={styles.ready} color="green" onClick={this.ready}>Ready</Button>
      </form>
    )
  }
}
export default hot(module)(Name)
