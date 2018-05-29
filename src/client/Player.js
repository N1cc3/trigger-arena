import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Player.css'

class Player extends Component {
  render() {
    return (
			<div className={styles.player}>
        <div className={styles.name}>{this.props.name}</div>
        <div className={styles.hp}>{this.props.hp}</div>
			</div>
    )
  }
}
export default hot(module)(Player)