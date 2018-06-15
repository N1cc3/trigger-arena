import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import styles from './CardMini.css'

class CardMini extends Component {
  constructor(props) {
    super(props)
    this.triggered = false
    this.isInstant = (this.props.card.trigger.id === 'instant')
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
      requestAnimationFrame(() => {
        el.removeAttribute('new')
      })
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
    el.addEventListener('animationend', (event) => {
      el.setAttribute('triggeredAnim', '1')
      el.addEventListener('transitionend', (event) => {
        this.props.card.onUse()
        el.addEventListener('transitionend', (event) => {
          setTimeout(() => {
            el.removeAttribute('triggeredAnim')
            el.addEventListener('transitionend', (event) => {
              this.props.card.onReady()
            }, {once: true})
          }, 200)
        }, {once: true})
      }, {once: true})
    }, {once: true})
  }

  render() {
    return (
      <div className={styles.card} used={(this.props.card.cooldown > 0).toString()}>
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
