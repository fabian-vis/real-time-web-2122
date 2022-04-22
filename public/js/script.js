let socket = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')
const username = prompt("what's your nickname?")

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
});

socket.on("chat message", ({
    username,
    message
}) => {
    const li = document.createElement("li");
    li.textContent = `[${username}] ${message}`;
    messages.appendChild(li);
});

document.querySelector("#message-form")
    .addEventListener("submit", e => {
        e.preventDefault();

        if (e.target.elements[0].value) {
            socket.emit("chat message", e.target.elements[0].value);
            e.target.reset();
        }
    });