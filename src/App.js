import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import Name from './Name'
import Cards from './Cards'
import Room from './Room'
import styles from './App.css'

const connectView = () => {
  return <div>Connecting...</div>
}

const roomView = (socket, onEnter) => {
  return <Room socket={socket} onEnter={onEnter}/>
}

const nameView = (socket, playerId, onReady) => {
  return <Name
    socket={socket}
    playerId={playerId}
    onReady={onReady}
  />
}

const cardsView = (socket) => {
  return <Cards socket={socket} />
}

class App extends Component {
  constructor(props) {
    super(props)

    this.socket = socketIOClient(window.location.href.startsWith('http://localhost') ? 'http://localhost:8080' : window.location.href)

    this.playerId = null

    const goToCards = () => {
      this.setState({active: cardsView(this.socket)})
    }

    const goToName = () => {
      this.setState({active: nameView(this.socket, this.playerId, goToCards)})
    }

    this.socket.on('connected', (res) => {
      this.playerId = res.playerId
      this.setState({active: roomView(this.socket, goToName)})
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
