// @flow

import express from 'express'
import http from 'http'
import SocketIO from 'socket.io'
import path from 'path'
import enforce from 'express-sslify'
import compression from 'compression'
import type { TurnResults } from './Game'
import Game from './Game'
import { gameTransform, turnResultsTransform } from '../api/Api'

const app = express()
const server = http.createServer(app)
const io = new SocketIO(server)
const port = process.env.PORT || 8080

app.use(enforce.HTTPS({trustProtoHeader: true}))
app.use(compression())
app.use(express.static(path.join(__dirname)))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

const clients: Array<string> = []
const games: Array<Game> = []

io.on('connection', socket => {

  const socketId: string = socket.id
  console.log(`New client connected: ${socketId}`)

  const playerId: number = clients.push(socketId) - 1

  socket.emit('connected')

  socket.on('join game', (gameId) => {

    gameId = Number(gameId)
    console.log(`Client ${socketId} wants to join game ${gameId}`)

    const game: ?Game = games.find(g => g.id === gameId)
    if (game == null || game.started) return

    const player = game.newPlayer(playerId)
    socket.join(gameId)
    io.to(gameId).emit('join game', player)

    const nextTurn: (number, number) => void = (useIdx, discardIdx) => {

      console.log(`Client ${socketId} wants to use card ${useIdx} and discard card ${discardIdx}`)
      if (game.animating) return

      game.animating = true
      const turnResults: TurnResults = game.nextTurn(useIdx, discardIdx)
      const turnResultsTransformed = turnResultsTransform(game, turnResults)

      socket.emit('cards', player.handCards)
      io.to(game.id).emit('next turn', { game: gameTransform(game), ...turnResultsTransformed })

    }

    socket.on('next turn', (actions) => {

      if (actions.useIdx != null && actions.discardIdx != null
        && actions.useIdx !== actions.discardIdx
        && game.getPlayerInTurn() === player
      ) nextTurn(actions.useIdx, actions.discardIdx)

    })

    socket.on('change name', (name) => {

      console.log(`Client ${socketId} wants to change name to ${name}`)
      player.name = name
      io.emit('change name', player)
      socket.emit('change name success')

    })

    socket.on('cards', () => {

      console.log(`Client ${socketId} asks for his cards`)
      socket.emit('cards', player.handCards)

    })

    socket.on('disconnect', () => {

      console.log(`Client ${socketId} disconnected`)
      player.hp = -Infinity
      if (player === game.getPlayerInTurn()) nextTurn(0, 1) // End player turn if they disconnect

    })

  })

  socket.on('host game', () => {

    console.log(`Client ${socketId} wants to host a game`)
    let gameId: number = Math.floor(Math.random() * 9999)
    while (games.map(g => g.id).includes(gameId)) {
      gameId = Math.floor(Math.random() * 9999)
    }

    const game: Game = new Game(gameId)
    games.push(game)

    socket.join(gameId)
    socket.emit('host game', game)

    socket.on('next turn', () => {

      game.animating = false

      for (const player of game.players) {
        if (player.isDead()) {
          io.to(clients[player.id]).emit('you died')
        }
      }

      io.to(clients[game.getPlayerInTurn().id]).emit('your turn')

    })

    socket.on('start game', () => {

      console.log(`Client ${socketId} wants to start the game`)
      game.started = true

      socket.emit('start game')

    })

  })

})

server.listen(port, () => console.log(`Listening on port ${port}`))
