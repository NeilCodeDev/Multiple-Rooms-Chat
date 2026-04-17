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

function createRoomCommand(socket, bufferedData, state) {
    const roomNameData = bufferedData.split("|")[1]
    const roomMaxUsersData = bufferedData.split("|")[2]
    if (!roomNameData || !roomMaxUsersData) return socket.write("Wrong /create command input")
    
    let isValidRoomName = false
    const roomName = roomNameData.trim()
    const roomMaxUsers = roomMaxUsersData.trim()


    //check for same room name
    Object.keys(state.roomsObj).forEach((item) => {
        if (state.roomsObj[item].roomName === roomName) {
            isValidRoomName = false
            return socket.write("this room name already exists, try different one.")
        } else {
            isValidRoomName = true
        }
    })

    if (!isValidRoomName) return
    
    const roomNumber = Object.keys(state.roomsObj).length + 1
    state.roomsObj[`room${roomNumber}`] = {
        maxUsers: Number(roomMaxUsers),
        roomName: roomName,
        roomUsersArray: []
    }
    socket.created_rooms.push(roomName)
    socket.write("Room was created!")
    renderRoomsLobby(state)
}


export { deleteRoomCommand, createRoomCommand }