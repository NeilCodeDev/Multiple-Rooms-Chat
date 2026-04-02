// render rooms for user
export default function renderRooms(state) {
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
    // state.userGlobalArray.forEach((client) => {
    //     client.write(roomString)
    // })
    return roomString
}
