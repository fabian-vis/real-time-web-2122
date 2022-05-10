const hostname = '127.0.0.1';
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));
var count = 0
const io = require('socket.io')(http)
const port = process.env.PORT || 4242



app.use(express.static(path.resolve('public')))

require('dotenv').config()

const {
    API_KEY
} = process.env;

const getData = endpoint => {
    return fetch(endpoint)
        .then(res => res.json())
        .catch(_ => null)
}

let paint
const connectieAPI = async () => {
    const endpoint = `https://www.rijksmuseum.nl/api/nl/collection?key=${API_KEY}&imgonly=true`
    const data = await getData(endpoint)

    let currentPainting = data.artObjects[Math.floor(Math.random() * data.artObjects.length)];
    paint = await currentPainting
}

connectieAPI()



// Link the templating engine to the express app
app.set("view engine", "ejs");

// Tell the views engine/ejs where the template files are stored (Settingname, value)
app.set("views", "views");


io.on('connection', (socket) => {

    io.emit('showData', paint)

    console.log('a user connected')
    let username = "anonymous";
    count++
    io.emit('usercnt', count)
    socket.on('message', (message) => {

        io.emit("chat message", {
            username,
            message
        });

        let artist = paint.principalOrFirstMaker
        let correct = artist.toLowerCase()

        let guess = message.toLowerCase()

        if (guess.includes(correct)) {
            message = `wist het juiste antwoord! het antwoord was ${artist}`

            io.emit("antwoord", {
                username,
                message
            })
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
        count--
        io.emit('usercnt', count)
    })

    socket.on("register username", newUsername => {
        username = newUsername;
    });
})


http.listen(port, () => {
    console.log(`Ai we live at http://${hostname}:${port}/`);
})