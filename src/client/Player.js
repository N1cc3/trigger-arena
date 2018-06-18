import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Player.css'
import CardMini from './CardMini'

import heart from './img/heart.png'
import skull0 from './img/skull0.png'
import skull1 from './img/skull1.png'
import skull2 from './img/skull2.png'
import skull3 from './img/skull3.png'
import skull4 from './img/skull4.png'
import skull5 from './img/skull5.png'
import skull6 from './img/skull6.png'
import skull7 from './img/skull7.png'

const skulls = [skull0, skull1, skull2, skull3, skull4, skull5, skull6, skull7]
const randomSkull = () => {
  return skulls[Math.floor(Math.random() * skulls.length)]
}

class Player extends Component {
  constructor(props) {
    super(props)
    this.skull = randomSkull()
  }

  render() {
    const boardCards = this.props.cards ? this.props.cards.map((card) => (
      <CardMini key={card.number} card={card}/>
    )) : null

    const hp = this.props.player.hp
    const hpStyle = {
      backgroundImage: `url(${hp > 0 ? heart : this.skull})`
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
