import net from 'net'

import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid';

import configObject from './config.js';
import {checkUserInput} from './utils/checkUserInput.js';
import { validateRoomCommand } from './utils/checkUserInput.js';
import renderRooms from './utils/renderRooms.js';

const PORT = process.env.PORT
const { defaultRoomsNumber, defaultRoomSize } = configObject

let state = {
    userGlobalArray: [],
    roomsObj: {}
}


function renderRoomsLobby() {
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


for (let i = 1; i < defaultRoomsNumber + 1; i++) {
    state.roomsObj[`room${i}`] = {
        maxUsers: defaultRoomSize,
        roomUsersArray: []
    }
}

console.log(state.roomsObj)

// render rooms for user
renderRooms(state)


const server = net.createServer((socket) => {
    const uuid = uuidv4();
    // set user info
    socket.id = uuid
    socket.username = `unnamed#${uuid.slice(0, 3)}`

    console.log("client joined: ", socket.username)

    state.userGlobalArray.push(socket)
    console.log(state.userGlobalArray.length)
    

    socket.write(renderRooms(state))

    let buffer = ''
    socket.on("data", (data) => {
        const userMsg = data.toString()
        buffer += userMsg;
        while (buffer.includes("\n")) {
            const boundary = buffer.indexOf("\n")
            let bufferedData = buffer.slice(0, boundary).trim()
            buffer = buffer.slice(boundary + 1)
        
                //help command
                if (bufferedData === "/help"){
                    socket.write(`\nCommands Console: \n /help - all commands listed\n /leave - leave a room\n /create | room name | max users number (e.g. 5) - create a room\n /username (input) - set custom username`)
                    continue
                }

                if (bufferedData.startsWith("/username")) {
                    const username = bufferedData.split(" ")[1]
                    socket.username = username
                    continue
                }

                if (!socket.room) {
                    // create room command
                    let parsedData;
                    try {
                        parsedData = JSON.parse(bufferedData)
                    } catch(error) {
                        console.error(error.message)
                    }

                    if (parsedData && parsedData.type === "CREATE_ROOM") {

                        try {
        
                            if (validateRoomCommand(parsedData)) return socket.write(`Error server: ${validateRoomCommand(parsedData)}`)

                            const roomNumber = Object.keys(state.roomsObj).length + 1
                            state.roomsObj[`room${roomNumber}`] = {
                                maxUsers: Number(parsedData.maxUsers),
                                roomName: parsedData.roomName,
                                roomUsersArray: []
                            }
                            socket.write("Room was created!")
                            renderRoomsLobby()
                            continue

                        } catch(error) {
                            console.error("Error: ", error.message)
                        }

                    }

                    if (!checkUserInput(bufferedData, state, socket)) continue
                    const userRoom = state.roomsObj[`room${bufferedData}`]

                    //check if room is full
                    if (userRoom.roomUsersArray.length >= userRoom.maxUsers) {
                        socket.write("\nThe room is full, try another one\n")
                        socket.write(renderRooms(state))
                        continue
                    }

                    socket.room = userRoom
                    userRoom.roomUsersArray.push(socket)
                    console.log(state.roomsObj)


                    state.userGlobalArray.forEach((client) => {
                        if (client.room) return
                        client.write(renderRooms(state))
                    })

                    socket.write("you joined: room " + bufferedData)

                    sameRoomMessage(socket, " has joined!")

                } else {
                    if (bufferedData === "/leave") {
                        if (socket.room) {
                            //sameRoomMessage(socket, " left")

                            socket.room.roomUsersArray = socket.room.roomUsersArray.filter((client) => {
                                return client !== socket
                            })
                            socket.room = undefined

                        renderRoomsLobby()
                        }
                        continue
                    }
                    
                    sameRoomMessage(socket, ": " + bufferedData)
                }
        }
    })

    socket.on("error", (error) => {
        console.error("Server Error: ", error.message)
    })
    
    socket.on("close", () => {
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
    })
})

server.listen(PORT, () => {
    console.log("server listening")
})