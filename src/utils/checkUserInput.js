export default function checkUserInput(data, state, socket) {
    const msg = Number(data.toString().trim())
    if (Number.isNaN(msg) ||
        msg > Object.keys(state.roomsObj).length ||
        msg < 1) {
        const wrongInputText = "wrong room input: " + msg
        socket.write(wrongInputText)
        console.log(wrongInputText)
        return false
    } else {
        return true
    }
}