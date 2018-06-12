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
      requestAnimationFrame(() => {
        el.setAttribute('instantAnim', '1')
      })
      el.addEventListener('transitionend', (event) => {
        setTimeout(() => {
          this.props.card.onUse()
          this.markUsed()
          el.addEventListener('transitionend', (event) => {
            setTimeout(() => {
              el.setAttribute('instantAnim', '2')
              el.addEventListener('transitionend', (event) => {
                this.props.card.onReady()
              }, {once: true})
            }, 200)
          }, {once: true})
        }, 200)
      }, {once: true})
    } else {
      el.setAttribute('new', '')
      requestAnimationFrame(() => {
        el.removeAttribute('new')
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.isInstant && this.props.card.triggered !== this.triggered) {
      if (this.props.card.triggered) {
        this.triggered = true
        this.trigger()
      } else {
        this.triggered = false
        const el = ReactDOM.findDOMNode(this)
        el.removeAttribute('triggeredAnim')
      }
    }
  }

  trigger() {
    const el = ReactDOM.findDOMNode(this)
    el.setAttribute('triggeredAnim', '0')
    el.addEventListener('animationend', (event) => {
      el.setAttribute('triggeredAnim', '1')
      el.addEventListener('transitionend', (event) => {
        this.props.card.onUse()
        this.markUsed()
        el.addEventListener('transitionend', (event) => {
          setTimeout(() => {
            el.setAttribute('triggeredAnim', '2')
            el.addEventListener('transitionend', (event) => {
              el.removeAttribute('triggeredAnim')
              this.props.card.onReady()
            }, {once: true})
          }, 200)
        }, {once: true})
      }, {once: true})
    }, {once: true})
  }

  markUsed() {
    const el = ReactDOM.findDOMNode(this)
    el.setAttribute('used', '')
  }

  markUnused() {
    const el = ReactDOM.findDOMNode(this)
    el.removeAttribute('used')
  }

  render() {
    return (
      <div className={styles.card}>
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
