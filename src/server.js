import net from 'net'

import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid';

const PORT = process.env.PORT

const defaulRoomsNumber = 5;
const defaultRoomSize = 2;
let userGlobalArray = [];
let roomsObj = {}

for (let i = 1; i < defaulRoomsNumber + 1; i++) {
    roomsObj[`room${i}`] = {
        maxUsers: defaultRoomSize,
        roomUsersArray: []
    }
}

console.log(roomsObj)

const server = net.createServer((socket) => {
    const uuid = uuidv4();
    socket.id = uuid
    console.log("client joined")

    userGlobalArray.push(socket)

    socket.on("data", (data) => {
        if (!socket.room) {
            const userData = data.toString().trim()
            const userRoom = roomsObj[`room${userData}`]
            socket.room = userRoom
            userRoom.roomUsersArray.push(socket)
            console.log(roomsObj)
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

