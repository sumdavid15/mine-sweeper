
function onMineClick() {
    gLevel.LIFE--
    document.querySelector('.life').innerHTML = '💖'.repeat(gLevel.LIFE)
    gLevel.MINES--
    document.querySelector('.mines span').innerHTML = gLevel.MINES
}

function addMines() {
    const emptyCells = getEmptyCells()
    if (!emptyCells.length) return

    for (let i = 0; i < gMinesCount; i++) {
        const randNum = getRandomInt(0, emptyCells.length)

        const randomCell = emptyCells[randNum]
        emptyCells.splice(randNum, 1)

        gBoard[randomCell.i][randomCell.j].isMine = true
    }
}

function countMinesAround(board, rowIdx, colIdx) {
    let count = 0
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            const currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
}

function renderRemainingMines() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine && !currCell.isShown) currCell.isShown = true
        }
    }
    renderBoard(gBoard)
}

function setMinesNegsCount() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine || currCell.isFirstClick) continue
            currCell.minesAroundCount = countMinesAround(gBoard, i, j)
        }
    }
}
