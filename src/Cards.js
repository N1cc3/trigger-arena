import React, { Component } from 'react'
import styles from './Cards.css'
import Card from './Card'

class Cards extends Component {
  constructor() {
    super()

    this.state = {
      cards: [
        {
          name: 'Test Card 1',
          trigger: {
            type: 'Action',
          },
          effect: {
            type: 'Damage',
            target: 'all',
            amount: 1,
          },
        },
        {
          name: 'Test Card 2',
          trigger: {
            type: 'Action',
          },
          effect: {
            type: 'Damage',
            target: 'all',
            amount: 1,
          },
        },
        {
          name: 'Test Card 3',
          trigger: {
            type: 'Action',
          },
          effect: {
            type: 'Damage',
            target: 'all',
            amount: 1,
          },
        },
      ],
    }
  }
  render() {
    return (
      <div className={styles.cards}>
        {this.state.cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    )
  }
}
export default Cards;
