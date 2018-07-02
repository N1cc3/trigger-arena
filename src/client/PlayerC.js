// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
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
import Player from '../server/Player'
import Card from '../server/Card'

const skulls = [skull0, skull1, skull2, skull3, skull4, skull5, skull6, skull7]
const randomSkull = () => {
  return skulls[Math.floor(Math.random() * skulls.length)]
}

type Props = {
  player: Player,
  cards: Array<Card>,
  highlight: boolean,
  dead: boolean,
}

type State = {
  hp: number,
  hpDiff: ?number,
}

class PlayerC extends React.Component<Props, State> {
  skull: string

  constructor(props) {
    super(props)
    this.state = {
      hp: this.props.player.hp,
      hpDiff: null,
    }
    this.skull = randomSkull()
  }

  componentDidUpdate() {
    const newHp = this.props.player.hp
    if (this.state.hp !== newHp) {
      const hpDiff = newHp - this.state.hp
      this.setState({hp: newHp, hpDiff: hpDiff})
    }
  }

  render() {
    const boardCards = this.props.cards ? this.props.cards.map((card) => (
      <CardMini key={card.number} card={card}/>
    )) : null

    const hpDiff = this.state.hpDiff
    const backgroundColor = hpDiff != null ? `rgba(${hpDiff < 0 ? 255 : 0}, ${hpDiff > 0 ? 255 : 0}, 0, ${0.2 * Math.abs(hpDiff)})` : 'none'
    const hpDiffStyle = {
      color: hpDiff != null && hpDiff > 0 ? 'green' : 'red',
      fontSize: hpDiff != null ? `${1.5 + 0.5 * Math.abs(hpDiff)}em` : '0',
      background: `radial-gradient(circle closest-side, ${backgroundColor}, transparent)`
    }
    const hpDiffElem = hpDiff != null ? <div className={styles.hpDiff} style={hpDiffStyle}
      onAnimationEnd={() => this.setState({hpDiff: null})}>
      {Math.abs(hpDiff)}
    </div> : null

    const hp = this.props.player.hp
    const hpStyle = {
      backgroundImage: `url(${hp > 0 ? heart : this.skull})`
    }
    const hpElement = <div className={styles.hp} style={hpStyle}>
      {hp > 0 ? hp : null}
      {hpDiffElem}
    </div>

    return (
			<div className={styles.player} highlight={this.props.highlight.toString()} dead={this.props.dead.toString()}>
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
export default hot(module)(PlayerC)
