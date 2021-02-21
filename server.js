const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const { v4: uuidV4 } = require("uuid")
const { ExpressPeerServer } = require("peer")
const peerServer = ExpressPeerServer(server, {debug: true})

app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use('/peerjs', peerServer)

app.get("/",(req, res)=>{
     res.redirect(`/${uuidV4()}`)
})

app.get("/:roomId", (req, res) =>{
     res.render('room', {roomId: req.params.roomId})
})


io.on('connection', socket => {
     socket.on('join-room', (roomId, userId)=>{
          socket.join(roomId)
          socket.to(roomId).broadcast.emit('user-connected', userId)
     })
})

server.listen(3030,()=>console.log("Server listening to port 3030"))