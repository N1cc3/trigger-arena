// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import socketIOClient from 'socket.io-client'
import styles from './Cards.css'
import CardC from './CardC'
import { Howl } from 'howler'
import deathSrc from './sounds/death.mp3'
import yourTurnSrc from './sounds/yourTurn.mp3'

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
  cards: Array<CardC>,
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
      yourTurnNotification: false,
      dead: false,
    }

    this.props.socket.on('cards', (cards) => {
      this.setState({
        cards: cards,
        useIdx: null,
        discardIdx: null,
      })
    })

    this.props.socket.on('use card', (useIdx) => {
      this.setState({
        useIdx: useIdx,
      })
    })

    this.props.socket.on('discard card', (discardIdx) => {
      this.setState({
        discardIdx: discardIdx,
      })
    })

    this.props.socket.on('your turn', () => {
      this.setState({
        yourTurn: true,
      })
      yourTurn.play()
    })

    this.props.socket.on('you died', () => {
      this.setState({
        dead: true,
      })
    })

    this.props.socket.emit('cards')

    // $FlowFixMe
    this.yourTurnAnimEnd = this.yourTurnAnimEnd.bind(this)
  }

  componentDidUpdate(prevProps, prevState, ss) {
    if (prevState.dead !== this.state.dead && this.state.dead === true) {
      death.play()
    }
  }

  yourTurnAnimEnd(): void {
    this.setState({yourTurn: false, yourTurnNotification: false})
  }

  render() {
    const yourTurn = this.state.yourTurn ? <div className={styles.yourTurnLayer}>
      <div className={styles.yourTurn} onAnimationEnd={this.yourTurnAnimEnd}>
        Your Turn!
      </div>
    </div> : null

    const youDied = this.state.dead ? (
      <div className={styles.youDied}>You died!</div>
    ) : null

    return (
      <div className={styles.cards}>
        {this.state.cards.map((card, index) => (
          <CardC key={index} idx={index} card={card} socket={this.props.socket}
                 use={this.state.useIdx === index}
                 discard={this.state.discardIdx === index}/>
        ))}
        {yourTurn}
        {youDied}
      </div>
    )
  }
}

export default hot(module)(Cards)
