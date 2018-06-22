import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Cards.css'
import Card from './Card'
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
      death.play()
    })

    this.socket.emit('cards')

    this.yourTurnAnimEnd = this.yourTurnAnimEnd.bind(this)
  }

  yourTurnAnimEnd() {
    this.setState({yourTurn: false})
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
