require('dotenv').config()
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const ChatModel = require('./mongoose/models/chatModel')

const app = express()
const httpServer = createServer(app)
global.io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost', 'http://localhost:4200']
  }
})
const port = process.env.PORT || 3000
global.clients = []

require('./mongoose/connection')

io.on('connection', socket => {

  /*
    * A username is mapped to a variable socket id & an avatar on the view, and
    * this mapping is peculiar to each user. 
    * 
    * _id represents each user on the database and it is not stored on the view.
  */

  newSocket = {
    username: socket.handshake.query.username,
    _id: socket.handshake.query._id,
    avatar: socket.handshake.query.avatar,
    sId: socket.id
  }

  socket.broadcast.emit('online', newSocket)
  clients.push(newSocket)

  socket.on('load', recipient => {

    ChatModel.find({
      $or: [
        {
          from: (clients.find(c => c.sId == socket.id))._id, //extract the _id of the client 
          to: (clients.find(c => c.sId == recipient))._id
        },
        {
          to: (clients.find(c => c.sId == socket.id))._id,
          from: (clients.find(c => c.sId == recipient))._id
        }
    ], 
    }, (err, chats) => {
      if (err) throw err
      socket.emit('load', chats)
    })
  })

  socket.on('send', (to, msg, cb) => {
    chatModel = new ChatModel({
      from: (clients.find(c => c.sId == socket.id))._id,
      to: (clients.find(c => c.sId == to))._id,
      body: msg.body,
      time: msg.time
    })

    chatModel.save(err => {
      if(err) throw err

      socket.to(to).emit('receive', socket.id, msg)
      cb()
    })

  })

  socket.on('disconnect', reason => {
    socket.broadcast.emit('offline', socket.id)
    clients.splice(clients.findIndex(c => c.sId == socket.id), 1)
  })
})

app.use(require('./routes'))

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})