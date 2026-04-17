import { sameRoomMessage } from '../logic/broadcastMessage.js';
import { displayHelp, updateUsername } from './commands/global.js'
import { deleteRoomCommand, createRoomCommand, joinRoomCommand } from './commands/lobby.js';
import { leaveRoomCommand, kickCommand } from './commands/room.js';

export function commandHandler(socket, bufferedData, state) {
    // global commands
    if (bufferedData === "/help") return displayHelp(socket)
    if (bufferedData.startsWith("/username")) return updateUsername(socket, bufferedData)

    // lobby commands
    if (!socket.room) {
        if (bufferedData.startsWith("/delete room")) return deleteRoomCommand(socket, bufferedData, state)
        if (bufferedData.startsWith("/create")) return createRoomCommand(socket, bufferedData, state)
        if (bufferedData.startsWith("/join")) return joinRoomCommand(socket, bufferedData, state)

    // room commands
    } else {
        if (bufferedData === "/leave") return leaveRoomCommand(socket, state)
        if (bufferedData.startsWith("/kick")) return kickCommand(socket, bufferedData, state)
        
        // display messages to users in same room
        sameRoomMessage(socket, ": " + bufferedData)
    }
}