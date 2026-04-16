import {checkUserInput} from '../utils/checkUserInput.js';
import { validateRoomCommand } from '../utils/checkUserInput.js';
import { renderRoomsLobby, sameRoomMessage } from '../logic/broadcastMessage.js';
import renderRooms from '../utils/renderRooms.js';

export function commandHandler(socket, bufferedData, state) {
    // help command
    if (bufferedData === "/help"){
        socket.write(`\nCommands Console: \n /help - all commands listed\n /leave - leave a room\n /create | room name | max users number (e.g. 5) - create a room\n /username (input) - set custom username\n /delete room | (room name)`)
        return
    }

    // username command
    if (bufferedData.startsWith("/username")) {
        const username = bufferedData.split(" ")[1]
        socket.username = username
        socket.roomUsername = socket.username
        return
    }

    if (!socket.room) {
        // delete room coomand
        if (bufferedData.startsWith("/delete room")) {
            console.log("Request: ",state.roomsObj)
    
            const room = bufferedData.split("|")[1].trim()
    
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
            return
        }
        
        // create room command
        let parsedData;
        try {
            parsedData = JSON.parse(bufferedData)
        } catch(error) {
            console.error(error.message)
        }
    
    
        if (parsedData && parsedData.type === "CREATE_ROOM") {
            try {
    
                if (validateRoomCommand(parsedData)) {
                    socket.write(`Error server: ${validateRoomCommand(parsedData)}`)
                    return
                }
    
                const roomNumber = Object.keys(state.roomsObj).length + 1
                state.roomsObj[`room${roomNumber}`] = {
                    maxUsers: Number(parsedData.maxUsers),
                    roomName: parsedData.roomName,
                    roomUsersArray: []
                }
                socket.created_rooms.push(parsedData.roomName)
                socket.write("Room was created!")
                renderRoomsLobby(state)
                return
    
            } catch(error) {
                console.error("Error: ", error.message)
            }
    
        }
    

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

        // implement give room owner prefix ---
        if (socket.room && socket.created_rooms.includes(userRoom.roomName)) {
            console.log("you are the owner")
            socket.roomUsername = `${socket.username} (Owner)`
        } else {
            socket.roomUsername = socket.username
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
        
        sameRoomMessage(socket, ": " + bufferedData)
    }
}