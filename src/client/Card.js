import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Card.css'
import Button from './comp/Button'

class Card extends Component {
  render() {
    const r = this.props.card.rarity
    let rarity = ''
    if (r < 200) {
      rarity = 'common'
    } else if (r < 500) {
      rarity = 'uncommon'
    } else if (r < 1000) {
      rarity = 'rare'
    } else if (r < 5000) {
      rarity = 'epic'
    } else if (r < 10000) {
      rarity = 'legendary'
    } else {
      rarity = 'mythic'
    }

    return (
      <div className={styles.card}
        rarity={rarity}
        use={this.props.use.toString()}
        discard={this.props.discard.toString()}>
        <div>
          <span className={styles.rarityGem} rarity={rarity} role="img" aria-label="Gem">💎</span> Rarity: {Math.round(this.props.card.rarity)}
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
            onClick={this.props.onUse}>
            Use
          </Button>
          <Button className={styles.discard} color="red"
            onClick={this.props.onDiscard}>
            Discard
          </Button>
        </div>
      </div>
    )
  }
}
export default hot(module)(Card)
