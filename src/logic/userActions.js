// help
function displayHelp(socket) {
    socket.write(`\nCommands Console: \n /help - all commands listed\n /leave - leave a room\n /create | room name | max users number (e.g. 5) - create a room\n /username (input) - set custom username\n /delete room | (room name)`)
}

// username
function updateUsername(socket, bufferedData) {
    const username = bufferedData.split(" ")[1]
    socket.username = username
    socket.roomUsername = socket.username
}

export {displayHelp, updateUsername}