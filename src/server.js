import net from 'net'

import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid';

import configObject from './config.js';
import checkUserInput from './utils/checkUserInput.js';

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
    console.log(state.userGlobalArray.length)
    

    // render rooms for user
    function renderRooms() {
        let roomString = ``
        for (let i = 1; i < Object.keys(state.roomsObj).length + 1; i++) {
            const roomLength = state.roomsObj[`room${i}`].roomUsersArray.length
            if (!roomLength == 0){
                roomString += `room #${i}: ${roomLength} online\n`
            } else{
                roomString += `room #${i}: empty\n`
            }
        }
        console.log(roomString)

        state.userGlobalArray.forEach((client) => {
            client.write(roomString)
        })
    }

    renderRooms()

    socket.on("data", (data) => {
        if (!socket.room) {
            if (!checkUserInput(data, state, socket)) return
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
        renderRooms()
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
        socket.room.roomUsersArray = socket.room.roomUsersArray.filter((client) => {
            return client !== socket
        })

        console.log("client disconnected: ", state.userGlobalArray.length)
        renderRooms()
    })
})

server.listen(PORT, () => {
    console.log("server listening")
})