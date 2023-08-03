
function onHintClick() {
    if (!gGame.isOn) return
    if (!gLevel.HINTS) return
    if (gGame.hint) return
    if (gGame.safeClick) return

    gGame.hint = true
    gLevel.HINTS--
    document.querySelector('.hints-btn span').innerHTML = gLevel.HINTS
}

function hintForNextMove(rowIdx, colIdx) {
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            const currCell = gBoard[i][j]
            if (currCell.isShown) continue
            gBoard[i][j].isShown = true
        }
    }
    savePrevMove(copyArrayOfArrays(gBoard), copyObject(gGame), copyObject(gLevel))
    renderBoard(gBoard)
    gGame.isOn = false
    gGame.hint = false
    gHintTimeOut = setTimeout(() => {
        undoGame()
        gGame.isOn = true
    }, 1000)
}