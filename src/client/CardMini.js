import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import styles from './CardMini.css'

class CardMini extends Component {
  constructor(props) {
    super(props)
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
    const el = ReactDOM.findDOMNode(this)
    if (this.isInstant) {
      el.setAttribute('instantAnim', '0')
      setTimeout(() => {
        el.setAttribute('instantAnim', '1')
      }, 50)
      el.addEventListener('transitionend', (event) => {
        setTimeout(() => {
          this.props.card.onUse()
          el.addEventListener('transitionend', (event) => {
            setTimeout(() => {
              el.setAttribute('instantAnim', '2')
              el.addEventListener('transitionend', (event) => {
                this.props.card.onReady()
              }, {once: true})
            }, 500)
          }, {once: true})
        }, 500)
      }, {once: true})
    } else {
      el.setAttribute('new', '')
      setTimeout(() => {
        el.removeAttribute('new')
        el.addEventListener('transitionend', (event) => {
          this.props.card.onReady()
        }, {once: true})
      }, 50)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.card.triggered === false) this.triggered = false
    if (this.props.card.triggered && this.triggered === false) this.trigger()
  }

  trigger() {
    this.triggered = true
    const el = ReactDOM.findDOMNode(this)
    el.setAttribute('triggeredAnim', '0')
    el.setAttribute('onTop', '')
    el.addEventListener('animationend', (event) => {
      el.setAttribute('triggeredAnim', '1')
      el.addEventListener('transitionend', (event) => {
        this.props.card.onUse()
        el.addEventListener('transitionend', (event) => {
          setTimeout(() => {
            el.removeAttribute('triggeredAnim')
            el.addEventListener('transitionend', (event) => {
              el.removeAttribute('onTop')
              this.props.card.onReady()
            }, {once: true})
          }, 200)
        }, {once: true})
      }, {once: true})
    }, {once: true})
  }

  render() {
    const cooldown = this.props.card.cooldown > 0 ?
      <div className={styles.cooldown}>
        {this.isPeriodic ? this.props.card.cooldown : '⌛'}
      </div>
    : null
    return (
      <div className={styles.card} used={(this.props.card.cooldown > 0).toString()} periodic={this.isPeriodic.toString()} rarity={this.rarity}>
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
