import { renderRoomsLobby, sameRoomMessage } from "../broadcastMessage.js"

// LEAVE
function leaveRoomCommand(socket, state) {
    if (socket.room) {
        sameRoomMessage(socket, " left")
        socket.room.roomUsersArray = socket.room.roomUsersArray.filter((client) => {
            return client !== socket
        })
        socket.room = undefined

        renderRoomsLobby(state)
    }
}

// KICK
function kickCommand(socket, bufferedData, state) {
    if (!socket.isOwner) return socket.write("you aren't the owner, cant use this command!")
    const kickName = bufferedData.split(" ")[1]
    if (!kickName) return socket.write("wrong kick command")

    const room = socket.room.roomUsersArray

    room.forEach((user) => {
        if (kickName.trim() !== user.username) return
        if (socket.username === kickName.trim()) return socket.write("Owners can't kick themselves")

        socket.room.roomUsersArray = socket.room.roomUsersArray.filter((client) => {
            return client !== user
        })
        sameRoomMessage(user, " was kicked")
        user.room = undefined
        user.write("you were kicked")
        renderRoomsLobby(state)
    })
}

export { leaveRoomCommand, kickCommand }