import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Player.css'
import CardMini from './CardMini'

class Player extends Component {
  render() {
    const boardCards = this.props.cards ? this.props.cards.map((card) => (
      <CardMini key={card.number} card={card}/>
    )) : null
    return (
			<div className={styles.player} highlight={this.props.highlight ? "true" : "false"}>
        <div className={styles.name}>{this.props.player.name}</div>
        <div className={styles.hp}>{this.props.player.hp}</div>
        {boardCards}
			</div>
    )
  }
}
export default hot(module)(Player)
