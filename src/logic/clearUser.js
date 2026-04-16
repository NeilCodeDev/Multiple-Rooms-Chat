import renderRooms from '../utils/renderRooms.js';
import { sameRoomMessage } from '../logic/broadcastMessage.js';

export function clearUser(socket, state) {
    //clear global array
    if (socket.room) sameRoomMessage(socket, " left")

    state.userGlobalArray = state.userGlobalArray.filter((client) => {
        return client !== socket
    })

    // clear room array
    if (socket.room) {
        socket.room.roomUsersArray = socket.room.roomUsersArray.filter((client) => {
            return client !== socket
        })
    }

    console.log("client disconnected: ", state.userGlobalArray.length)
    renderRooms(state)
}