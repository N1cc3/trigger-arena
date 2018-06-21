import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import styles from './CardMini.css'

class CardMini extends Component {
  constructor(props) {
    super(props)

    this.state = {
      new: true,
    }

    this.triggered = false
    this.isInstant = (this.props.card.trigger.id === 'instant')
    this.isPeriodic = (this.props.card.trigger.id === 'periodic')
    const r = this.props.card.rarity
    if (r < 200) {
      this.rarity = 'common'
    } else if (r < 500) {
      this.rarity = 'uncommon'
    } else if (r < 1000) {
      this.rarity = 'rare'
    } else if (r < 5000) {
      this.rarity = 'epic'
    } else if (r < 10000) {
      this.rarity = 'legendary'
    } else {
      this.rarity = 'mythic'
    }
  }

  componentDidMount() {
    if (this.isInstant) {
      this.setState({new: false})
      setTimeout(() => {
        this.props.card.onUse()
      }, 1500)
      setTimeout(() => {
        this.props.card.onReady()
      }, 5000)
    } else {
      setTimeout(() => {
        this.setState({new: false})
        this.props.card.onReady()
      }, 800)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.card.triggered === false) this.triggered = false
    if (this.props.card.triggered && this.triggered === false) this.trigger()
  }

  trigger() {
    this.triggered = true
    const el = ReactDOM.findDOMNode(this)
    el.setAttribute('triggered', 'true')
    setTimeout(() => {
      this.props.card.onUse()
    }, 1500)
    setTimeout(() => {
      el.removeAttribute('triggered')
      this.props.card.onReady()
    }, 5000)
  }

  render() {
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
        rarity={this.rarity}
        new={this.state.new.toString()}>
        <div>
          # {Math.round(this.props.card.number)}
        </div>
        <div>
          <span role="img" aria-label="Gem" className={styles.rarityGem} rarity={this.rarity}>💎</span> {Math.round(this.props.card.rarity)}
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
