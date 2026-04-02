import net from 'net'

import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid';

import configObject from './config.js';
import checkUserInput from './utils/checkUserInput.js';
import renderRooms from './utils/renderRooms.js';

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

// render rooms for user
renderRooms(state)


const server = net.createServer((socket) => {
    const uuid = uuidv4();
    socket.id = uuid
    console.log("client joined")

    state.userGlobalArray.push(socket)
    console.log(state.userGlobalArray.length)
    

    renderRooms(state)

    socket.on("data", (data) => {
        if (!socket.room) {
            if (!checkUserInput(data, state, socket)) return
            const userData = data.toString().trim()
            const userRoom = state.roomsObj[`room${userData}`]
            socket.room = userRoom
            userRoom.roomUsersArray.push(socket)
            console.log(state.roomsObj)
            renderRooms(state)
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

    socket.on("close", () => {
        //clear global array
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