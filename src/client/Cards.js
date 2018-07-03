// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import styles from './Cards.css'
import Card from './CardC'
import Button from './comp/Button'
import { Howl } from 'howler'
import deathSrc from './sounds/death.mp3'
import yourTurnSrc from './sounds/yourTurn.mp3'
import socketIOClient from 'socket.io-client'

const death = new Howl({
  src: [deathSrc],
})

const yourTurn = new Howl({
  src: [yourTurnSrc],
})

type Props = {
  socket: socketIOClient,
}

type State = {
  cards: Array<Card>,
  useIdx: ?number,
  discardIdx: ?number,
  yourTurn: boolean,
  yourTurnNotification: boolean,
  dead: boolean,
}

class Cards extends React.Component<Props, State> {
  socket: socketIOClient

  constructor(props) {
    super(props)

    this.state = {
      cards: [],
      useIdx: null,
      discardIdx: null,
      yourTurn: false,
      dead: false,
    }

    this.socket = this.props.socket

    this.socket.on('cards', (cards) => {
      this.setState({
        cards: cards,
        useIdx: null,
        discardIdx: null,
      })
    })

    this.socket.on('use card', (useIdx) => {
      this.setState({
        useIdx: useIdx,
      })
    })

    this.socket.on('discard card', (discardIdx) => {
      this.setState({
        discardIdx: discardIdx,
      })
    })

    this.socket.on('your turn', () => {
      this.setState({
        yourTurn: true,
      })
      yourTurn.play()
    })

    this.socket.on('you died', () => {
      this.setState({
        dead: true,
      })
    })

    this.socket.emit('cards')
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dead !== this.state.dead && this.state.dead === true) {
      death.play()
    }
  }

  yourTurnAnimEnd: () => void = () => {
    this.setState({yourTurnNotification: false})
  }

  ready: () => void = () => {
    this.socket.emit('player action', {useIdx: this.state.useIdx, discardIdx: this.state.discardIdx})
  }

  render() {
    const yourTurn = this.state.yourTurn ? <div className={styles.yourTurnLayer}><div className={styles.yourTurn} onAnimationEnd={this.yourTurnAnimEnd}>
      Your Turn!
    </div></div> : null

    const youDied = this.state.dead ? (
      <div className={styles.youDied}>You died!</div>
    ) : null

    return (
      <div className={styles.cards}>
        {this.state.cards.map((card, index) => (
          <Card key={index} id={index} card={card} socket={this.socket}
            use={this.state.useIdx === index}
            discard={this.state.discardIdx === index}
          />
        ))}
        {yourTurn}
        {youDied}
      </div>
    )
  }
}
export default hot(module)(Cards)
