import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Card.css'
import Button from './comp/Button'

class Card extends Component {
  constructor(props) {
    super(props)

    this.socket = this.props.socket

    this.useCard = this.useCard.bind(this)
    this.discardCard = this.discardCard.bind(this)
  }

  useCard() {
    this.socket.emit('use card', this.props.id)
  }

  discardCard() {
    this.socket.emit('discard card', this.props.id)
  }

  render() {
    return (
      <div className={styles.card}
        use={this.props.use ? "true" : "false"}
        discard={this.props.discard ? "true" : "false"}>
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
          <span role="img" aria-label="Target">🎯</span> Target: {this.props.card.target.longName}
        </div>
        <div className={styles.buttons}>
          <Button className={styles.use} color="green"
            onClick={this.useCard}>
            Use
          </Button>
          <Button className={styles.discard} color="red"
            onClick={this.discardCard}>
            Discard
          </Button>
        </div>
      </div>
    )
  }
}
export default hot(module)(Card)
