import {checkUserInput} from '../utils/checkUserInput.js';
import { renderRoomsLobby, sameRoomMessage } from '../logic/broadcastMessage.js';
import renderRooms from '../utils/renderRooms.js';
import { displayHelp, updateUsername } from './commands/global.js'
import { deleteRoomCommand } from './commands/lobby.js';

export function commandHandler(socket, bufferedData, state) {
    // global commands
    if (bufferedData === "/help") return displayHelp(socket)
    if (bufferedData.startsWith("/username")) return updateUsername(socket, bufferedData)

    // lobby commands
    if (!socket.room) {
        if (bufferedData.startsWith("/delete room")) return deleteRoomCommand(socket, bufferedData, state)
        
        // create room command
        if (bufferedData.startsWith("/create")) {
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

            return
        }
    
    
        // JOIN ROOM
        if (!checkUserInput(bufferedData, state, socket)) return
        const userRoom = state.roomsObj[`room${bufferedData}`]
    
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
        socket.write("you joined: room " + bufferedData)
        sameRoomMessage(socket, " has joined!")
    
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