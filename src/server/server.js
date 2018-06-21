import express from 'express'
import http from 'http'
import SocketIO from 'socket.io'
import path from 'path'
import enforce from 'express-sslify'
import compression from 'compression'
import Game from './Game.js'
import Player from './Player.js'

const app = express()
const server = http.Server(app)
const io = new SocketIO(server)
const port = process.env.PORT || 8080

app.use(enforce.HTTPS({ trustProtoHeader: true }))
app.use(compression())
app.use(express.static(path.join(__dirname)))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
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
    while (games.map(g => g.id).includes(gameId)) {
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
    if (game && !game.started) {
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
    const events = game.nextTurn()
    socket.emit('cards', player.handCards)
    game.animating = true
    for (const p of game.players) {
      if (p.dead) {
        io.to(clients[p.id]).emit('you died')
      }
    }
    io.to(game.id).emit('next turn', {game: game, events: events})
  }

  socket.on('use card', (useIdx) => {
    console.log(`Client ${socketId} wants to use card ${useIdx}`)
    if (game.players.indexOf(player) === game.turnIdx
        && player.discardIdx !== useIdx
        && game.started
        && !game.animating) {
      player.use(useIdx)
      socket.emit('use card', useIdx)
      if (player.isReady()) nextTurn()
    }
  })

  socket.on('discard card', (discardIdx) => {
    console.log(`Client ${socketId} wants to discard card ${discardIdx}`)
    if (game.players.indexOf(player) === game.turnIdx
        && player.useIdx !== discardIdx
        && game.started
        && !game.animating) {
      player.discard(discardIdx)
      socket.emit('discard card', discardIdx)
      if (player.isReady()) nextTurn()
    }
  })

  socket.on('next turn', () => {
    game.animating = false
    io.to(clients[game.players[game.turnIdx].id]).emit('your turn')
  })

  socket.on('cards', () => {
    console.log(`Client ${socketId} asks for his cards`)
    socket.emit('cards', player.handCards)
  })

  socket.on('start game', () => {
    console.log(`Client ${socketId} wants to start the game`)
    game.started = true
    socket.emit('start game')
  })

  socket.on('disconnect', () => {
    console.log(`Client ${socketId} disconnected`)
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
