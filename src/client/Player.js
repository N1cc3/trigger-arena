import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Player.css'
import CardMini from './CardMini'
import heart from './img/heart.png'
import skull0 from './img/skull0.png'

class Player extends Component {
  render() {
    const boardCards = this.props.cards ? this.props.cards.map((card) => (
      <CardMini key={card.number} card={card}/>
    )) : null

    const hp = this.props.player.hp
    const hpStyle = {
      backgroundImage: `url(${hp > 0 ? heart : skull0})`
    }
    const hpElement = <div className={styles.hp} style={hpStyle}>
      {hp > 0 ? hp : null}
    </div>

    return (
			<div className={styles.player} highlight={this.props.highlight ? "true" : "false"}>
        <div className={styles.stats}>
          <div className={styles.name}>{this.props.player.name}</div>
          {hpElement}
        </div>
        <div className={styles.cards}>
          {boardCards}
        </div>
			</div>
    )
  }
}
export default hot(module)(Player)
