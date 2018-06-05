import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Card.css'

class Card extends Component {
  constructor(props) {
    super(props)

    this.socket = this.props.socket
  }

  useCard(id) {
    this.socket.emit('use card', id)
  }

  discardCard(id) {
    this.socket.emit('discard card', id)
  }

  render() {
    return (
      <div className={styles.card}>
        <div>
          <span role="img" aria-label="Gem">💎</span> Rarity: {Math.round(this.props.card.rarity)}
        </div>
        <div>
          <span role="img" aria-label="Light Bulb">💡</span> Trigger: {this.props.card.trigger.longName}
        </div>
        <div>
          <span role="img" aria-label="Lightning">⚡</span> Effect: {this.props.card.effect.longName}
        </div>
        <div>
          <span role="img" aria-label="Person">👤</span> Target: {this.props.card.target.longName}
        </div>
        <div className={styles.buttons}>
          <button className={styles.use} onClick={() => this.useCard(this.props.id)}>Use</button>
          <button className={styles.discard} onClick={() => this.discardCard(this.props.id)}>Discard</button>
        </div>
      </div>
    )
  }
}
export default hot(module)(Card)
