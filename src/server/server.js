import express from 'express'
import http from 'http'
import SocketIO from 'socket.io'
import path from 'path'
import { randomCard } from './data.js'
import Game from './Game.js'
import Player from './Player.js'

const app = express()
const server = http.Server(app)
const io = new SocketIO(server)
const port = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, 'build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const clients = []
const games = []

io.on('connection', socket => {
  const socketId = socket.id
  console.log(`New client connected: ${socketId}`)
  const playerId = clients.push(socketId) - 1
  const player = new Player(playerId)

  socket.emit('connected', player)

  socket.on('host game', () => {
    console.log(`Client ${socketId} wants to host a game`)
    let gameId = Math.floor(Math.random() * 9999)
    while (games.includes(gameId)) {
      gameId = Math.floor(Math.random() * 9999)
    }
    const game = new Game(gameId)
    games.push(game)
    socket.join(gameId)
    socket.emit('host game', game)
  })

  socket.on('join game', (gameId) => {
    gameId = Number(gameId)
    console.log(`Client ${socketId} wants to join game ${gameId}`)
    const gameExists = games.find(g => g.id === gameId)
    if (gameExists) {
      socket.join(gameId)
      io.to(gameId).emit('join game', player)
    }
  })

  socket.on('change name', (name) => {
    console.log(`Client ${socketId} wants to change name to ${name}`)
    player.name = name
    io.emit('change name', player)
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
