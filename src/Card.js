import React, { Component } from 'react'
import styles from './Card.css'

class Card extends Component {
  render() {
    return (
      <div className={styles.card}>
        <div>
          {this.props.card.name}
        </div>
        <div>
          {this.props.card.trigger.type}
        </div>
        <div>
          {this.props.card.effect.type}
        </div>
      </div>
    )
  }
}
export default Card;
