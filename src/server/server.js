import express from 'express'
import http from 'http'
import SocketIO from 'socket.io'
import path from 'path'
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
  let game = null

  socket.emit('connected', player)

  socket.on('host game', () => {
    console.log(`Client ${socketId} wants to host a game`)
    let gameId = Math.floor(Math.random() * 9999)
    while (games.includes(gameId)) {
      gameId = Math.floor(Math.random() * 9999)
    }
    game = new Game(gameId)
    games.push(game)
    socket.join(gameId)
    socket.emit('host game', game)
  })

  socket.on('join game', (gameId) => {
    gameId = Number(gameId)
    console.log(`Client ${socketId} wants to join game ${gameId}`)
    game = games.find(g => g.id === gameId)
    if (game) {
      socket.join(gameId)
      game.players.push(player)
      io.to(gameId).emit('join game', player)
    }
  })

  socket.on('change name', (name) => {
    console.log(`Client ${socketId} wants to change name to ${name}`)
    player.name = name
    io.emit('change name', player)
  })

  const nextTurn = () => {
    game.nextTurn()
    socket.emit('cards', player.handCards)
    io.to(game.id).emit('next turn', game)
  }

  socket.on('use card', (useIdx) => {
    console.log(`Client ${socketId} wants to use card ${useIdx}`)
    console.log(`${game.players.indexOf(player)} === ${game.turnIdx}`)
    if (game.players.indexOf(player) === game.turnIdx) {
      player.useIdx = useIdx
      socket.emit('use card', {
        card: useIdx,
      })
      console.log(`Player is ready: ${player.isReady()}`)
      if (player.isReady()) nextTurn()
    }
  })

  socket.on('discard card', (discardIdx) => {
    console.log(`Client ${socketId} wants to discard card ${discardIdx}`)
    console.log(`${game.players.indexOf(player)} === ${game.turnIdx}`)
    if (game.players.indexOf(player) === game.turnIdx) {
      player.discardIdx = discardIdx
      socket.emit('discard card', {
        card: discardIdx,
      })
      console.log(`Player is ready: ${player.isReady()}`)
      if (player.isReady()) nextTurn()
    }
  })

  socket.on('cards', () => {
    console.log(`Client ${socketId} asks for his cards`)
    socket.emit('cards', player.handCards)
  })

  socket.on('start game', () => {
    console.log(`Client ${socketId} wants to start the game`)
    socket.emit('start game')
  })

  socket.on('disconnect', () => {
    console.log(`Client ${socketId} disconnected`)
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
