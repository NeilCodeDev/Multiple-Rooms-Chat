import { renderRoomsLobby, sameRoomMessage } from "../broadcastMessage.js"
import { checkUserInput } from "../../utils/checkUserInput.js"
import renderRooms from "../../utils/renderRooms.js"

// DELETE
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

// CREATE
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

// JOIN
function joinRoomCommand(socket, bufferedData, state) {
    const roomInputData = bufferedData.split(" ")[1]
    if (!roomInputData) return socket.write("Wrong /join command.")
    const roomInput = roomInputData.trim()
    console.log("rooMinpout: ", roomInput)

    if (!checkUserInput(roomInput, state, socket)) return
    const userRoom = state.roomsObj[`room${roomInput}`]

    //check if room is full
    if (userRoom.roomUsersArray.length >= userRoom.maxUsers) {
        socket.write("\nThe room is full, try another one\n")
        socket.write(renderRooms(state))
        return
    }
    socket.room = userRoom
    userRoom.roomUsersArray.push(socket)
    socket.write(renderRooms(state))

    // give owner prefix
    if (socket.room && socket.created_rooms.includes(userRoom.roomName)) {
        socket.roomUsername = `${socket.username} (Owner)`
        socket.isOwner = true
    } else {
        socket.roomUsername = socket.username
        socket.isOwner = false
    }
    
    state.userGlobalArray.forEach((client) => {
        if (client.room) return
        client.write(renderRooms(state))
    })
    
    socket.write("you joined: room " + roomInput)
    sameRoomMessage(socket, " has joined!")
}


export { deleteRoomCommand, createRoomCommand, joinRoomCommand }