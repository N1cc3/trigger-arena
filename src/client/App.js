// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import socketIOClient from 'socket.io-client'
import Name from './NameSelectionView'
import Cards from './PlayerView'
import Door from './EnterGameIdView'
import Menu from './MenuView'
import GameC from './HostView'
import styles from './App.css'
import { Howl } from 'howler'
import menuMusicSrc from './sounds/menuMusic.mp3'
import gameOverMusicSrc from './sounds/gameOverMusic.mp3'
import Game from '../server/Game'

const menuMusic = new Howl({
  src: [menuMusicSrc],
  loop: true,
})

const gameOverMusic = new Howl({
  src: [gameOverMusicSrc],
  loop: true,
})

const onGameOver = () => {
  menuMusic.fade(1, 0, 2000)
  gameOverMusic.play()
  gameOverMusic.fade(0, 1, 2000)
}

const connectView = () => {
  return <div>Connecting...</div>
}

const doorView = (socket, onJoin) => {
  return <Door socket={socket} onJoin={onJoin}/>
}

const nameView = (socket, onReady) => {
  return <Name
    socket={socket}
    onReady={onReady}
  />
}

const cardsView = (socket) => {
  return <Cards socket={socket}/>
}

const menuView = (socket, onJoin, onHost) => {
  return <Menu socket={socket} onJoin={onJoin} onHost={onHost}/>
}

const gameView = (socket, game) => {
  return <GameC socket={socket} game={game} onGameOver={onGameOver}/>
}

type Props = {
  socket: socketIOClient,
}

type State = {
  active: React.Node,
}

class App extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      playerId: null,
      active: connectView(),
    }

    const goToCards = () => {
      this.setState({active: cardsView(this.props.socket)})
    }

    const goToName = () => {
      this.setState({active: nameView(this.props.socket, goToCards)})
    }

    const goToDoor = () => {
      this.setState({active: doorView(this.props.socket, goToName)})
    }

    const goToGame = (game: Game) => {
      menuMusic.play()
      menuMusic.fade(0, 1, 2000)
      this.setState({active: gameView(this.props.socket, game)})
    }

    this.props.socket.on('connected', () => {
      this.setState({
        active: menuView(this.props.socket, goToDoor, goToGame),
      })
    })
  }

  componentWillUnmount() {
    this.props.socket.close()
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
