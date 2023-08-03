
function safeClick() {
    if (!gGame.isOn) return
    if (gGame.safeClick) return
    if (!gLevel.SAFE_CLICKS) return

    gGame.safeClick = true
    document.querySelector('.safe-btn span').innerHTML = --gLevel.SAFE_CLICKS

    const safeCells = []
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isShown && !currCell.isMine) safeCells.push({ i, j })
        }
    }
    const randNum = getRandomInt(0, safeCells.length)
    const randomCell = safeCells[randNum]
    gBoard[randomCell.i][randomCell.j].isSafe = true

    const elCell = document.querySelector(`[data-i="${randomCell.i}"][data-j="${randomCell.j}"]`)
    elCell.classList.add('safe-mark')

    gSafeTimeOut = setTimeout(() => {
        elCell.classList.remove('safe-mark')
        gBoard[randomCell.i][randomCell.j].isSafe = false
        gGame.safeClick = false
        renderBoard(gBoard)
    }, 3000)
}

function removeAllCellSafeMark(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            if (currCell.isSafe) currCell.isSafe = false
        }
    }
    return board
}