import express from 'express'
import http from 'http'
import SocketIO from 'socket.io'
import path from 'path'
import { randomCard } from './server/data.js'

let app = express()
let server = http.Server(app)
let io = new SocketIO(server)
let port = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, 'build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const clients = []
const games = []

io.on('connection', socket => {
  let socketId = socket.id
  console.log(`New client connected: ${socketId}`)
  let playerId = clients.push(socketId) - 1
  let playerName = 'New player'

  socket.emit('connected', {
    playerId: playerId,
  })

  socket.on('host game', () => {
    console.log(`Client ${socketId} wants to host a game`)
    let gameId = Math.floor(Math.random() * 9999)
    while (games.includes(gameId)) {
      gameId = Math.floor(Math.random() * 9999)
    }
    games.push(gameId)
    socket.join(gameId)
    socket.emit('host game', {
      success: true,
      gameId: gameId,
    })
  })

  socket.on('join game', (gameId) => {
    gameId = Number(gameId)
    console.log(`Client ${socketId} wants to join game ${gameId}`)
    let gameExists = games.includes(gameId)
    if (gameExists) socket.join(gameId)
    io.to(gameId).emit('join game', {
      success: gameExists,
      playerId: playerId,
      name: playerName,
    })
  })

  socket.on('change name', (name) => {
    console.log(`Client ${socketId} wants to change name to ${name}`)
    playerName = name
    io.emit('change name', {
      name: name,
      playerId: playerId,
    })
  })

  socket.on('use card', (cardId) => {
    console.log(`Client ${socketId} wants to use card ${cardId}`)
    socket.emit('use card', {
      card: cardId,
    })
  })

  socket.on('discard card', (cardId) => {
    console.log(`Client ${socketId} wants to discard card ${cardId}`)
    socket.emit('discard card', {
      card: cardId,
    })
  })

  socket.on('cards', () => {
    console.log(`Client ${socketId} asks for his cards`)
    socket.emit('cards', [
      randomCard(),
      randomCard(),
      randomCard(),
    ])
  })

  socket.on('disconnect', () => {
    console.log(`Client ${socketId} disconnected`)
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
