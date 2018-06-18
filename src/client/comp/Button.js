import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import styles from './Button.css'
import { Howl } from 'howler'
import buttonDownSoundSrc from '../sounds/buttonDown.mp3'
import buttonUpSoundSrc from '../sounds/buttonUp.mp3'

const buttonDownSound = new Howl({
  src: [buttonDownSoundSrc]
})

const buttonUpSound = new Howl({
  src: [buttonUpSoundSrc]
})

const buttonDown = () => {
  buttonDownSound.play()
}

const buttonUp = () => {
  buttonUpSound.play()
}

class Button extends Component {
  render() {
    const style = {
      backgroundColor: this.props.color,
      borderColor: this.props.color,
    }
    return (
      <button className={[styles.button, this.props.className].join(' ')} style={style}
        onTouchStart={buttonDown} onMouseDown={buttonDown}
        onTouchEnd={buttonUp} onMouseUp={buttonUp}
        onClick={this.props.onClick}>
        {this.props.children}
      </button>
    )
  }
}
export default hot(module)(Button)
