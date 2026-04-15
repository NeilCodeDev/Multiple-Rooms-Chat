// render rooms for user
export default function renderRooms(state) {
    let roomString = ``
    for (let i = 1; i < Object.keys(state.roomsObj).length + 1; i++) {
        const roomLength = state.roomsObj[`room${i}`].roomUsersArray.length
        const roomMaxUsers = state.roomsObj[`room${i}`].maxUsers
        const roomName = state.roomsObj[`room${i}`].roomName ? `(${state.roomsObj[`room${i}`].roomName})` : ""

        if (roomLength > 0) {
            roomString += `room #${i}${roomName}: ${roomLength}/${roomMaxUsers} online\n`
        } else {
            roomString += `room #${i}${roomName}: ${roomLength}/${roomMaxUsers}\n`
        }
    }
    console.log(roomString)
    return roomString
}
