import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Player.css'
import CardMini from './CardMini'
import heart from './img/heart.png'

class Player extends Component {
  render() {
    const boardCards = this.props.cards ? this.props.cards.map((card) => (
      <CardMini key={card.number} card={card}/>
    )) : null
    const heartStyle = {
      backgroundImage: `url(${heart})`
    }
    return (
			<div className={styles.player} highlight={this.props.highlight ? "true" : "false"}>
        <div className={styles.stats}>
          <div className={styles.name}>{this.props.player.name}</div>
          <div className={styles.hp} style={heartStyle}>{this.props.player.hp}</div>
        </div>
        <div className={styles.cards}>
          {boardCards}
        </div>
			</div>
    )
  }
}
export default hot(module)(Player)
