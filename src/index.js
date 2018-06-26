import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './client/App'
import registerServiceWorker from './client/registerServiceWorker'
import socketIOClient from "socket.io-client"

const socket = socketIOClient(process.env.NODE_ENV === 'development' ?
  'http://localhost:8080' :
  'https://trigger-arena.herokuapp.com')

ReactDOM.render(<App socket={socket} />, document.getElementById('root'))
registerServiceWorker()
