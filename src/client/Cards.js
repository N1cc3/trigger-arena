import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Cards.css'
import Card from './Card'

class Cards extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cards: [],
    }

    this.socket = this.props.socket

    this.socket.on('cards', (cards) => {
      this.setState({
        cards: cards,
      })
    })
    this.socket.emit('cards')
  }

  render() {
    return (
      <div className={styles.cards}>
        {this.state.cards.map((card, index) => (
          <Card key={index} card={card} socket={this.socket} />
        ))}
      </div>
    )
  }
}
export default hot(module)(Cards)
