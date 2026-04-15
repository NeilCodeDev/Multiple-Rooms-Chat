import net from 'net'

import 'dotenv/config'

const PORT = process.env.PORT || 9000
const HOST = '127.0.0.1'

const client = net.connect(PORT, HOST, () => {
    console.log("connected to server")
})

client.on("error", (error) => {
    console.error('client error: ', error.message)
})

client.on("data", (data) => {
    console.log(data.toString())
})

process.stdin.on("data", (data) => {
    if (data.toString().trim().startsWith("/create")) {
        const userInput = data.toString().trim().split("|")

        const commandMsg = {
            type: "CREATE_ROOM",
            roomName: userInput[1].trim(),
            maxUsers: userInput[2]

        }

        client.write(JSON.stringify(commandMsg))
        return
    }
    client.write(data.toString())

})