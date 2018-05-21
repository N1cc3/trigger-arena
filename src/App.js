import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import Nick from './Nick'
import Cards from './Cards'
import styles from './App.css'

const connectView = () => {
  return <div>Connecting...</div>
}

const cardsView = (socket) => {
  return <Cards socket={socket} />
}

const nickView = (socket, playerId, onReady) => {
  return <Nick
    socket={socket}
    playerId={playerId}
    onReady={onReady}
  />
}

class App extends Component {
  constructor(props) {
    super(props)

    this.socket = socketIOClient(window.location.href.startsWith('http://localhost') ? 'http://localhost:8080' : window.location.href)

    this.playerId = null

    this.socket.on('connected', (res) => {
      this.playerId = res.playerId
      this.setState({active: nickView(this.socket, this.playerId, () => {
        this.setState({active: cardsView(this.socket)})
      })})
    })

    this.state = {
      active: connectView(),
    }
  }

  render() {
    return (
      <div className={styles.app}>
        {this.state.active}
      </div>
    )
  }
}
export default App
