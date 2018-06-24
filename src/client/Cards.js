import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Cards.css'
import Card from './Card'
import Button from './comp/Button'
import { Howl } from 'howler'
import deathSrc from './sounds/death.mp3'
import yourTurnSrc from './sounds/yourTurn.mp3'

const death = new Howl({
  src: [deathSrc],
})

const yourTurn = new Howl({
  src: [yourTurnSrc],
})

class Cards extends Component {
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

    this.socket = this.props.socket

    this.socket.on('cards', (cards) => {
      this.setState({
        cards: cards,
        useIdx: null,
        discardIdx: null,
        yourTurn: false,
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

    this.yourTurnAnimEnd = this.yourTurnAnimEnd.bind(this)
    this.ready = this.ready.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dead !== this.state.dead && this.state.dead === true) {
      death.play()
    }
    if (prevState.yourTurn !== this.state.yourTurn && this.state.yourTurn === true) {
      this.setState({yourTurnNotification: true})
    }
    if (this.state.useIdx !== null
      && prevState.useIdx !== this.state.useIdx
      && this.state.discardIdx === this.state.useIdx) {
      this.setState({discardIdx: null})
    }
    if (this.state.discardIdx !== null
      && prevState.discardIdx !== this.state.discardIdx
      && this.state.discardIdx === this.state.useIdx) {
      this.setState({useIdx: null})
    }
  }

  yourTurnAnimEnd() {
    this.setState({yourTurnNotification: false})
  }

  ready() {
    this.socket.emit('player action', {useIdx: this.state.useIdx, discardIdx: this.state.discardIdx})
  }

  render() {
    const yourTurnNotification = this.state.yourTurnNotification ? <div className={styles.yourTurnLayer}><div className={styles.yourTurn} onAnimationEnd={this.yourTurnAnimEnd}>
      Your Turn!
    </div></div> : null

    const youDied = this.state.dead ? (
      <div className={styles.youDied}>You died!</div>
    ) : null

    const readyBtn = this.state.useIdx !== null && this.state.discardIdx !== null && this.state.yourTurn === true ? (
      <div className={styles.readyBtnLayer}>
        <Button className={styles.readyBtn} color="lightgreen" onClick={this.ready}>
          <span role="img" aria-label="Check Mark">✔</span>
        </Button>
      </div>
    ) : null

    return (
      <div className={styles.cards}>
        {this.state.cards.map((card, index) => (
          <Card key={index} card={card}
            use={this.state.useIdx === index}
            discard={this.state.discardIdx === index}
            onUse={() => this.setState({useIdx: index})}
            onDiscard={() => this.setState({discardIdx: index})}
          />
        ))}
        {yourTurnNotification}
        {youDied}
        {readyBtn}
      </div>
    )
  }
}
export default hot(module)(Cards)
