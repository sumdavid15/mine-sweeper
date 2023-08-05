
function activateManual() {
    if (gGame.isManual) return
    if (gGame.isOn) return
    initGame()
    difficulty = 'Manually'
    gGame.isManual = true
    gGame.isOn = false
}

function createManualMines(i, j) {
    gBoard[i][j].isShown = true
    gBoard[i][j].isMine = true
    renderBoard(gBoard)
}

function hideCreatedManualMines() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            gBoard[i][j].isShown = false
        }
    }
}

