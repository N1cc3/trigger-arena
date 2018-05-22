const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')

// our localhost port
const port = Number(process.env.PORT || 8080)

const app = express()

app.use(express.static(path.join(__dirname, 'build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

const clients = []
const rooms = []

const testCards = [
  {
    id: 1,
    name: 'Test Card 1',
    trigger: {
      type: 'Action',
    },
    effect: {
      type: 'Damage',
      target: 'all',
      amount: 1,
    },
  },
  {
    id: 2,
    name: 'Test Card 2',
    trigger: {
      type: 'Action',
    },
    effect: {
      type: 'Damage',
      target: 'self',
      amount: 2,
    },
  },
  {
    id: 3,
    name: 'Test Card 3',
    trigger: {
      type: 'Action',
    },
    effect: {
      type: 'Damage',
      target: 'all',
      amount: 3,
    },
  },
]

io.on('connection', socket => {
  let socketId = socket.id
  console.log(`New client connected: ${socketId}`)
  let playerId = clients.push(socketId) - 1

  socket.emit('connected', {
    playerId: playerId,
  })

  socket.on('enter room', (room) => {
    console.log(`Client ${socketId} wants to enter room ${room}`)
    io.sockets.emit('enter room', {
      room: room,
    })
  })

  socket.on('change name', (name) => {
    console.log(`Client ${socketId} wants to change name to ${name}`)
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
    socket.emit('cards', testCards)
  })

  socket.on('disconnect', () => {
    console.log(`Client ${socketId} disconnected`)
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
