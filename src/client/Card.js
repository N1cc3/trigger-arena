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
          Rarity: {Math.round(this.props.card.rarity)}
        </div>
        <div>
          Trigger: {this.props.card.trigger.displayName}
        </div>
        <div>
          Effect: {this.props.card.effect.displayName}
        </div>
        <div>
          Target: {this.props.card.target.displayName}
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
