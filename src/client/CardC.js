// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import styles from './CardC.css'
import Button from './comp/Button'
import Card from '../server/Card'

type RarityName = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'

type Props = {
  idx: 0 | 1 | 2,
  card: Card,
  onUse: () => void,
  onDiscard: () => void,
  use: boolean,
  discard: boolean,
}

class CardC extends React.Component<Props> {
  render() {
    const rarityName: RarityName = getRarityName(this.props.card.rarity)

    return (
      <div className={styles.card}
           rarity={rarityName}
           use={this.props.use.toString()}
           discard={this.props.discard.toString()}>
        <div>
          <span className={styles.rarityGem} rarity={rarityName} role="img"
                aria-label="Gem">💎</span> Rarity: {Math.round(this.props.card.rarity)}
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

export default hot(module)(CardC)

const getRarityName: (number) => RarityName = (r) => {
  if (r < 200) {
    return 'common'
  } else if (r < 500) {
    return 'uncommon'
  } else if (r < 1000) {
    return 'rare'
  } else if (r < 5000) {
    return 'epic'
  } else if (r < 10000) {
    return 'legendary'
  } else {
    return 'mythic'
  }
}
