import renderRooms from '../utils/renderRooms.js';

function renderRoomsLobby(state) {
    state.userGlobalArray.forEach((client) => {
        if (client.room) return
        client.write(renderRooms(state))
    })
}

function sameRoomMessage(socket, message) {
    if (!socket || !socket.room || !socket.room.roomUsersArray) return
    const room = socket.room.roomUsersArray
    room.forEach(client => {
        if (client === socket) return
        client.write(`${socket.roomUsername}${message}`)
        console.log(`${socket.roomUsername}${message}`)
    });
}

export { renderRoomsLobby, sameRoomMessage }