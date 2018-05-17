import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import Cards from './Cards'

class App extends Component {
  constructor() {
    super()

    this.state = {
      endpoint: window.location.href,
    }

    this.socket = socketIOClient(this.state.endpoint)
  }

  render() {
    return (
      <Cards socket={this.socket} />
    )
  }
}
export default App;
