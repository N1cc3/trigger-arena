import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import socketIOClient from 'socket.io-client'
import Name from './Name'
import Cards from './Cards'
import Door from './Door'
import Menu from './Menu'
import Game from './Game'
import styles from './App.css'

const connectView = () => {
  return <div>Connecting...</div>
}

const doorView = (socket, onJoin) => {
  return <Door socket={socket} onJoin={onJoin}/>
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

const menuView = (socket, onJoin, onHost) => {
  return <Menu socket={socket} onJoin={onJoin} onHost={onHost}/>
}

const gameView = (socket, gameId) => {
  return <Game socket={socket} gameId={gameId}/>
}

class App extends Component {
  constructor(props) {
    super(props)

    this.socket = socketIOClient(process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://trigger-arena.herokuapp.com')

    this.playerId = null

    const goToCards = () => {
      this.setState({active: cardsView(this.socket)})
    }

    const goToName = () => {
      this.setState({active: nameView(this.socket, this.playerId, goToDoor)})
    }

    const goToDoor = () => {
      this.setState({active: doorView(this.socket, goToCards)})
    }

    const goToGame = (gameId) => {
      this.setState({active: gameView(this.socket, gameId)})
    }

    this.socket.on('connected', (player) => {
      this.playerId = player.id
      this.setState({active: menuView(this.socket, goToName, goToGame)})
    })

    this.state = {
      active: connectView(),
    }
  }

  componentWillUnmount() {
    this.socket.close()
  }

  render() {
    return (
      <div className={styles.app}>
        {this.state.active}
      </div>
    )
  }
}
export default hot(module)(App)
