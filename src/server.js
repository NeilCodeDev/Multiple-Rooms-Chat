import net from 'net'

import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid';

import configObject from './config.js';

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

console.log(state.roomsObj)

const server = net.createServer((socket) => {
    const uuid = uuidv4();
    socket.id = uuid
    console.log("client joined")

    state.userGlobalArray.push(socket)

    socket.on("data", (data) => {
        if (!socket.room) {
            const userData = data.toString().trim()
            const userRoom = state.roomsObj[`room${userData}`]
            socket.room = userRoom
            userRoom.roomUsersArray.push(socket)
            console.log(state.roomsObj)
        } else {
            const msg = data.toString().trim()
            const room = socket.room.roomUsersArray
            room.forEach(client => {
                if (client === socket) return
                client.write(msg)
            });
        }

    })


    socket.on("error", (error) => {
        console.error("Server Error: ", error.message)
    })
})

server.listen(PORT, () => {
    console.log("server listening")
})

