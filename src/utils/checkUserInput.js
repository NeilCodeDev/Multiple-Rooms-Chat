function checkUserInput(bufferedData, state, socket) {
    const msg = Number(bufferedData)
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

function validateRoomCommand(userInput, state) {
    console.log("ValidiationRoom: ", state)
    if (isNaN(Number(userInput.maxUsers))) {
        return "the max user is NaN"
    } 

    if (Number(userInput.maxUsers) < 2) {
        return "the max user number is less than minimum 2"
    }

    return null
}

export { checkUserInput, validateRoomCommand }