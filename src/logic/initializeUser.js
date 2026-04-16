import { v4 as uuidv4 } from 'uuid';

export function initializeUser(socket, state) {
    const uuid = uuidv4();

    // set user info
    socket.id = uuid
    socket.username = `unnamed#${uuid.slice(0, 3)}`
    socket.created_rooms = []
    console.log("client joined: ", socket.username)
    state.userGlobalArray.push(socket)
    console.log(state.userGlobalArray.length)
}