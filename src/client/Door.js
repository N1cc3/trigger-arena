// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import styles from './Door.css'
import Button from './comp/Button'
import socketIOClient from 'socket.io-client'

type Props = {
  socket: socketIOClient,
  onJoin: (string) => void,
}

type State = {
  gameId: string,
}

class Door extends React.Component<Props, State> {
  socket: socketIOClient

  constructor(props) {
    super(props)

    this.state = {
      gameId: '',
    }

    this.socket = this.props.socket

    this.socket.on('join game', (player) => {
      this.props.onJoin(this.state.gameId)
    })
  }

  changeGameId: (SyntheticInputEvent<HTMLInputElement>) => void = (event) => {
    const gameId = event.target.value
    this.setState({gameId: gameId})
  }

  ready(e) {
    e.preventDefault()
    this.socket.emit('join game', this.state.gameId)
  }

  render() {
    return (
      <form className={styles.box} onSubmit={this.ready}>
        <input className={styles.gameIdInput} type="text" name="code"
               pattern="([0-9][0-9][0-9][0-9])" maxLength="4" inputMode="numeric"
               required autoFocus placeholder="Game ID" onChange={this.changeGameId}/>
        <Button className={styles.ready} color="turquoise" onClick={this.ready}>Enter</Button>
      </form>
    )
  }
}

export default hot(module)(Door)
