import { renderRoomsLobby } from "../broadcastMessage.js"

// delete room
function deleteRoomCommand(socket, bufferedData, state) {
    const roomData = bufferedData.split("|")[1]

    if (!roomData) return socket.write("Wrong delete room command.")
    const room = roomData.trim()

    const isCreator = socket.created_rooms.includes(room) ? true : false
    if (!isCreator) return
    
    Object.keys(state.roomsObj).forEach((item) => {
        if (state.roomsObj[item].roomName && state.roomsObj[item].roomName === room) {
            // kick all users in same room
            const roomArray = state.roomsObj[item].roomUsersArray
            if (roomArray.length > 0) {
                roomArray.forEach((user) => {
                    user.write("This room was deleted...")
                    user.room = undefined
                })
            }
            
            delete state.roomsObj[item]
            
            renderRoomsLobby(state)
        }
    })
}


export { deleteRoomCommand }