import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'

class App extends Component {
  constructor() {
    super()

    this.state = {
      endpoint: process.env.SERVER_URL || "http://localhost:8080",
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
      <div style={{ textAlign: "center" }}>
        <button onClick={() => this.send() }>Change Color</button>
        <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
        <button id="red" onClick={() => this.setColor('red')}>Red</button>
      </div>
    )
  }
}
export default App;
