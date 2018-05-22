import React, { Component } from 'react'
import styles from './Player.css'

class Player extends Component {
  constructor(props) {
    super(props)

    this.state = {}

  }

  render() {
    return (
			<div className={styles.player}>
        {this.props.name}
			</div>
    )
  }
}
export default Player
