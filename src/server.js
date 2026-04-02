import net from 'net'

import 'dotenv/config'

const PORT = process.env.PORT

const server = net.createServer((socket) => {
    console.log("client joined")

    socket.on("error", (error) => {
        console.error("Server Error: ", error.message)
    })
})

server.listen(PORT, () => {
    console.log("server listening")
})