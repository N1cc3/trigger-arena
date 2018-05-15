import React, { Component } from 'react'
import styles from './Card.css'

class Card extends Component {
  constructor() {
    super()

    this.state = {
      name: 'Test Card',
      trigger: {
        type: 'Action',
      },
      effect: {
        type: 'Damage',
        target: 'all',
        amount: 1,
      },
    }
  }
  render() {
    return (
      <div className={styles.card}>
        <div>
          {this.state.name}
        </div>
        <div>
          {this.state.trigger.type}
        </div>
        <div>
          {this.state.effect.type}
        </div>
      </div>
    )
  }
}
export default Card;
