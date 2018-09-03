// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import ReactDOM from 'react-dom'
import styles from './CardMini.css'
import { Howl } from 'howler'
import foomSrc from './sounds/foom.mp3'
import type { CardData } from '../api/Api'

const foom = new Howl({
  src: [foomSrc],
})

type RarityName = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'

type CardMiniProps = {
  card: CardData,
}

type CardMiniState = {
  new: boolean,
}

class CardMini extends React.Component<CardMiniProps, CardMiniState> {
  triggered: boolean
  isInstant: boolean
  isPeriodic: boolean

  constructor(props) {
    super(props)

    this.state = {
      new: true,
    }

    this.triggered = false
    this.isInstant = (this.props.card.trigger.type === 'instant')
    this.isPeriodic = (this.props.card.trigger.type === 'periodic')
  }

  componentDidMount() {
    if (this.isInstant) {
      this.setState({new: false})
      setTimeout(() => {
        if (this.props.card.onUse) this.props.card.onUse()
      }, 1500)
      setTimeout(() => {
        foom.play()
      }, 4000)
      setTimeout(() => {
        if (this.props.card.onReady) this.props.card.onReady()
      }, 5000)
    } else {
      setTimeout(() => {
        this.setState({new: false})
        if (this.props.card.onReady) this.props.card.onReady()
      }, 800)
    }
  }

  componentDidUpdate(prevProps, prevState, ss) {
    if (this.props.card.triggered === false) this.triggered = false
    if (this.props.card.triggered && this.triggered === false) this.trigger()
  }

  trigger() {
    this.triggered = true
    const el = ReactDOM.findDOMNode(this)
    if (el instanceof Element) {
      el.setAttribute('triggered', 'true')
      setTimeout(() => {
        this.props.card.onUse()
      }, 800)
      setTimeout(() => {
        el.removeAttribute('triggered')
        this.props.card.onReady()
      }, 3000)
    }
  }

  render() {
    const rarityName: RarityName = getRarityName(this.props.card.rarity)

    const cooldown = this.props.card.cooldown > 0 ?
      <div className={styles.cooldown}>
        {this.isPeriodic ? this.props.card.cooldown : '⌛'}
      </div>
      : null

    return (
      <div className={styles.card}
           instant={this.isInstant.toString()}
           used={(this.props.card.cooldown > 0).toString()}
           periodic={this.isPeriodic.toString()}
           rarity={rarityName}
           new={this.state.new.toString()}>
        <div>
          # {this.props.card.id}
        </div>
        <div>
          <span role="img" aria-label="Gem" className={styles.rarityGem}
                rarity={rarityName}>💎</span> {Math.round(this.props.card.rarity)}
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
        {cooldown}
      </div>
    )
  }

}

export default hot(module)(CardMini)

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
