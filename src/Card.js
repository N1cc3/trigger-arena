import React, { Component } from 'react'
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
          {this.props.card.name}
        </div>
        <div>
          {this.props.card.trigger.type}
        </div>
        <div>
          {this.props.card.effect.type}
        </div>
        <div className={styles.buttons}>
          <button className={styles.use} onClick={() => this.useCard(this.props.card.id)}>Use</button>
          <button className={styles.discard} onClick={() => this.discardCard(this.props.card.id)}>Discard</button>
        </div>
      </div>
    )
  }
}
export default Card
