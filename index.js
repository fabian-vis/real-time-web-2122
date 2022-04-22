const hostname = '127.0.0.1';
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4242

app.use(express.static(path.resolve('public')))

io.on('connection', (socket) => {
    console.log('a user connected')
    let username = "anonymous";

    socket.on('message', (message) => {
        io.emit("chat message", {
            username,
            message
        });
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on("register username", newUsername => {
        username = newUsername;
    });
})

http.listen(port, () => {
    console.log(`Ai we live at http://${hostname}:${port}/`);
})