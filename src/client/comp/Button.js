// @flow

import { hot } from 'react-hot-loader'
import * as React from 'react'
import styles from './Button.css'
import { Howl } from 'howler'
import buttonDownSoundSrc from '../sounds/buttonDown.mp3'
import buttonUpSoundSrc from '../sounds/buttonUp.mp3'

const buttonDownSound = new Howl({
  src: [buttonDownSoundSrc],
})

const buttonUpSound = new Howl({
  src: [buttonUpSoundSrc],
})

type Props = {
  className: ?string,
  color: ?string,
  onClick: ?(e: SyntheticEvent<HTMLDivElement>) => void,
  children: ?React.Node
}

type State = {
  pressed: boolean,
}

class Button extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      pressed: false,
    }
  }

  buttonDown: () => void = () => {
    buttonDownSound.play()
    this.setState({pressed: true})
  }

  buttonUp: () => void = () => {
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
           onMouseLeave={this.state.pressed ? this.buttonUp : null}
           onClick={this.props.onClick} pressed={this.state.pressed.toString()}>
        {this.props.children}
      </div>
    )
  }
}

export default hot(module)(Button)
