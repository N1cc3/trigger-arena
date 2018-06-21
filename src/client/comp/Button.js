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

class Button extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pressed: false,
    }
    this.buttonDown = this.buttonDown.bind(this)
    this.buttonUp = this.buttonUp.bind(this)
  }

  buttonDown() {
    buttonDownSound.play()
    this.setState({pressed: true})
  }

  buttonUp() {
    buttonUpSound.play()
    this.setState({pressed: false})
  }

  render() {
    const style = {
      backgroundColor: this.props.color,
      borderColor: this.props.color,
    }
    return (
      <div className={[styles.button, this.props.className].join(' ')} style={style}
        onTouchStart={this.buttonDown} onMouseDown={this.buttonDown}
        onTouchEnd={this.buttonUp} onMouseUp={this.buttonUp}
        onClick={this.props.onClick} pressed={this.state.pressed.toString()}>
        {this.props.children}
      </div>
    )
  }
}
export default hot(module)(Button)