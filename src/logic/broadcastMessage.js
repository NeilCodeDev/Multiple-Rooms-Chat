import renderRooms from '../utils/renderRooms.js';

function renderRoomsLobby(state) {
    state.userGlobalArray.forEach((client) => {
        if (client.room) return
        client.write(renderRooms(state))
    })
}

function sameRoomMessage(socket, message) {
    if (!socket.room || !socket.room.roomUsersArray) return
    const room = socket.room.roomUsersArray

    room.forEach(client => {
        if (client === socket) return
        client.write(`${socket.username}${message}`)
    });
}

export { renderRoomsLobby, sameRoomMessage }