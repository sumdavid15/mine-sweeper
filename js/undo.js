function undoGame() {
    if (!gPrevMove.length) return
    gPrevMove.pop()
    clearTimeout(gSafeTimeOut)
    clearTimeout(gHintTimeOut)
    gGame.safeClick = false

    const [board, game, level] = gPrevMove[gPrevMove.length - 1]

    gBoard = copyArrayOfArrays(removeAllCellSafeMark(board))

    gLevel.LIFE = level.LIFE
    gLevel.MINES = level.MINES

    gGame.isOn = game.isOn
    gGame.shownCount = game.shownCount
    gGame.markedCount = game.markedCount

    if (gGame.isOn) {
        document.querySelector('.smiley').innerHTML = '😃'
        startTimer()
    }
    document.querySelector('.mines span').innerHTML = gLevel.MINES
    document.querySelector('.life').innerHTML = '💖'.repeat(gLevel.LIFE)
    renderBoard(board)

    if (gPrevMove.length === 1) {
        gPrevMove = []
        initGame()
    }
}
