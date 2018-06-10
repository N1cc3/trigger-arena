import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './CardMini.css'

class CardMini extends Component {
  render() {
    return (
      <div className={styles.card} big={this.props.big}>
        <div>
          # {Math.round(this.props.card.number)}
        </div>
        <div>
          <span role="img" aria-label="Gem">💎</span> {Math.round(this.props.card.rarity)}
        </div>
        <div>
          <span role="img" aria-label="Light Bulb">💡</span> {this.props.card.trigger.shortName}
        </div>
        <div>
          <span role="img" aria-label="Lightning">⚡</span> {this.props.card.effect.shortName}
        </div>
        <div>
          <span role="img" aria-label="Target">🎯</span> {this.props.card.target.shortName}
        </div>
      </div>
    )
  }
}
export default hot(module)(CardMini)
