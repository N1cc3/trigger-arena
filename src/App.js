import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import Cards from './Cards'

class App extends Component {
  constructor(props) {
    super(props)

    this.socket = socketIOClient(window.location.href.startsWith('http://localhost') ? 'http://localhost:8080' : window.location.href)

    this.socket.on('use card', (res) => {

    })

    this.socket.on('discard card', (res) => {

    })
  }

  render() {
    return (
      <Cards socket={this.socket} />
    )
  }
}
export default App
