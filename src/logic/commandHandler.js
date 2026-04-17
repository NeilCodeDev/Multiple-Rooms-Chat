import { renderRoomsLobby, sameRoomMessage } from '../logic/broadcastMessage.js';
import { displayHelp, updateUsername } from './commands/global.js'
import { deleteRoomCommand, createRoomCommand, joinRoomCommand } from './commands/lobby.js';

export function commandHandler(socket, bufferedData, state) {
    // global commands
    if (bufferedData === "/help") return displayHelp(socket)
    if (bufferedData.startsWith("/username")) return updateUsername(socket, bufferedData)

    // lobby commands
    if (!socket.room) {
        if (bufferedData.startsWith("/delete room")) return deleteRoomCommand(socket, bufferedData, state)
        if (bufferedData.startsWith("/create")) return createRoomCommand(socket, bufferedData, state)
        if (bufferedData.startsWith("/join")) return joinRoomCommand(socket, bufferedData, state)

    } else {
        if (bufferedData === "/leave") {
            if (socket.room) {
                sameRoomMessage(socket, " left")
    
                socket.room.roomUsersArray = socket.room.roomUsersArray.filter((client) => {
                    return client !== socket
                })
                socket.room = undefined
    
            renderRoomsLobby(state)
            }
            return
        }

        if (bufferedData.startsWith("/kick")) {
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
        
        sameRoomMessage(socket, ": " + bufferedData)
    }
}