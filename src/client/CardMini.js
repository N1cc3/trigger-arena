import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import styles from './CardMini.css'

class CardMini extends Component {

  componentDidMount() {
    if (this.props.instant) {
      const el = ReactDOM.findDOMNode(this)
      el.setAttribute('instantAnim0', '')
      requestAnimationFrame(() => {
        el.setAttribute('instantAnim1', '')
      })
      el.addEventListener('transitionend', (event) => {
        setTimeout(() => {
          this.markUsed()
          el.addEventListener('transitionend', (event) => {
            setTimeout(() => {
              el.setAttribute('instantAnim2', '')
              el.addEventListener('transitionend', (event) => {
                this.props.done()
              }, {once: true})
            }, 200)
          }, {once: true})
        }, 200)
      }, {once: true})
    }
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
