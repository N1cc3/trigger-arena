import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './CardMini.css'

class CardMini extends Component {
  render() {
    return (
      <div className={styles.card}>
        <div>
          #{Math.round(this.props.card.number)}
        </div>
        <div>
          <span role="img" aria-label="Gem">💎</span> {Math.round(this.props.card.rarity)}
        </div>
        <div>
          <span role="img" aria-label="Light Bulb">💡</span> {this.props.card.trigger.displayName}
        </div>
        <div>
          <span role="img" aria-label="Lightning">⚡</span> {this.props.card.effect.displayName}
        </div>
        <div>
          <span role="img" aria-label="Person">👤</span> {this.props.card.target.displayName}
        </div>
      </div>
    )
  }
}
export default hot(module)(CardMini)
