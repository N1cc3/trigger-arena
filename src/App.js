import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import Card from './Card'

class App extends Component {
  constructor() {
    super()

    this.state = {
      endpoint: 'https://trigger-arena.herokuapp.com',
      color: 'white'
    }
  }

  send = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('change color', this.state.color) // change 'red' to this.state.color
  }

  setColor = (color) => {
    this.setState({ color })
  }

  render() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on('change color', (col) => {
      document.body.style.backgroundColor = col
    })

    return (
      <div>
        <Card></Card>
        <Card></Card>
        <Card></Card>
      </div>
    )
  }
}
export default App;
