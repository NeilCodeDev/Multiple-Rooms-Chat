import net from 'net'
import 'dotenv/config'

import configObject from './config.js';
import renderRooms from './utils/renderRooms.js';
import { initializeUser } from './logic/initializeUser.js';
import { commandHandler } from './logic/commandHandler.js';
import { clearUser } from './logic/clearUser.js';

const PORT = process.env.PORT
const { defaultRoomsNumber, defaultRoomSize } = configObject

let state = {
    userGlobalArray: [],
    roomsObj: {}
}

for (let i = 1; i < defaultRoomsNumber + 1; i++) {
    state.roomsObj[`room${i}`] = {
        maxUsers: defaultRoomSize,
        roomUsersArray: []
    }
}

// render rooms for user
renderRooms(state)

const server = net.createServer((socket) => {
    initializeUser(socket, state)
    socket.write(renderRooms(state))

    let buffer = ''
    socket.on("data", (data) => {
        const userMsg = data.toString()
        buffer += userMsg;
        while (buffer.includes("\n")) {

            const boundary = buffer.indexOf("\n")
            let bufferedData = buffer.slice(0, boundary).trim()
            buffer = buffer.slice(boundary + 1)
            if (!bufferedData || bufferedData === "") continue

            commandHandler(socket, bufferedData, state)
        }
    })

    socket.on("error", (error) => {
        console.error("Server Error: ", error.message)
    })
    
    socket.on("close", () => {
        clearUser(socket, state)
    })
})

server.listen(PORT, () => {
    console.log("server listening")
})