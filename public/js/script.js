let socket = io()
let messages = document.querySelector('.raden ul')
let online = document.querySelector('.online')
let input = document.querySelector('input')
const username = prompt("what's your nickname?")
const element = document.getElementById('bruhton')

element.addEventListener("click", () => {
    var bruhton = document.querySelector(".artiest2");
    bruhton.classList.add("artiestVisible");
})

document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault()
    if (input.value) {
        socket.emit('message', input.value)
        input.value = ''
    }
})

socket.on('message', message => {
    messages.appendChild(Object.assign(document.createElement('li'), {
        textContent: message
    }))
    messages.scrollTop = messages.scrollHeight
})

socket.on("connect", () => {
    socket.emit("register username", username);
})

socket.on("chat message", ({
    username,
    message
}) => {
    const li = document.createElement("li");
    li.textContent = `[${username}] ${message}`;
    messages.appendChild(li);
});

socket.on("antwoord", ({
    username,
    message
}) => {
    const li = document.createElement("li");
    li.textContent = `${username} ${message}`;
    messages.appendChild(li);
});

socket.on('usercnt', function (msg) {
    document.getElementById("count").innerHTML = msg
})

document.querySelector("#message-form")
    .addEventListener("submit", e => {
        e.preventDefault();

        if (e.target.elements[0].value) {
            socket.emit("chat message", e.target.elements[0].value);
            e.target.reset();
        }
    });

socket.on('showData', (paint) => {
    document.querySelector('.schilderij').appendChild(Object.assign(document.createElement('li'), {
        textContent: paint.title
    }))
    document.querySelector('.schilderij').appendChild(Object.assign(document.createElement('img'), {
        src: paint.webImage.url
    }))
    document.querySelector('.artiest2').appendChild(Object.assign(document.createElement('li'), {
        textContent: paint.principalOrFirstMaker
    }))
})