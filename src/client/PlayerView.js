// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import socketIOClient from 'socket.io-client'
import styles from './PlayerView.css'
import CardC from './CardC'
import { Howl } from 'howler'
import deathSrc from './sounds/death.mp3'
import yourTurnSrc from './sounds/yourTurn.mp3'
import Button from './comp/Button'

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

class PlayerView extends React.Component<Props, State> {
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
  }

  componentDidUpdate(prevProps, prevState, ss) {
    if (prevState.dead !== this.state.dead && this.state.dead === true) {
      death.play()
    }

    if (this.state.useIdx != null
      && prevState.useIdx !== this.state.discardIdx
      && this.state.useIdx === this.state.discardIdx) this.setState({discardIdx: null})

    if (this.state.discardIdx != null
      && prevState.discardIdx !== this.state.useIdx
      && this.state.discardIdx === this.state.useIdx) this.setState({useIdx: null})
  }

  yourTurnAnimEnd: () => void = () => {
    this.setState({yourTurn: false, yourTurnNotification: false})
  }

  endTurn: () => void = () => {
    this.props.socket.emit('next turn', {useIdx: this.state.useIdx, discardIdx: this.state.discardIdx})
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

    const cardsChosen = this.state.useIdx != null && this.state.discardIdx != null

    return (
      <div className={styles.playerView}>
        <div className={styles.cards}>
          {this.state.cards.map((card, index) => (
            <CardC key={index} idx={index} card={card} socket={this.props.socket}
                   use={this.state.useIdx === index} discard={this.state.discardIdx === index}
                   onUse={() => this.setState({useIdx: index})} onDiscard={() => this.setState({discardIdx: index})}
            />
          ))}
        </div>

        <div className={styles.sidebar}>
          <Button className={styles.endTurn} color={cardsChosen ? 'green' : 'grey'} onClick={() => this.endTurn()}>
            End Turn
          </Button>
        </div>

        {yourTurn}
        {youDied}
      </div>
    )
  }
}

export default hot(module)(PlayerView)
