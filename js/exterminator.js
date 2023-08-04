
function exterminator() {
    if (gGame.isExterminated) return
    if (!gGame.isOn) return
    const mines = exterminateMines()

    if (!mines) return alert(`Sorry, there are only ${gLevel.MINES} mines left. Can't delete 3 mines.`)
    gGame.isExterminated = true

    gLevel.MINES = gLevel.MINES - mines
    document.querySelector('.mines span').innerHTML = gLevel.MINES

    setMinesNegsCount()
    savePrevMove(copyArrayOfArrays(gBoard), copyObject(gGame), copyObject(gLevel))
    renderBoard(gBoard)
    alert('3 Mines were exterminated')
}

function exterminateMines() {
    const minesCells = getMines()
    if (minesCells.length < 3) return false

    for (let i = 0; i < 3; i++) {
        const randNum = getRandomInt(0, minesCells.length)
        const randomCell = minesCells[randNum]
        minesCells.splice(randNum, 1)
        gBoard[randomCell.i][randomCell.j].isMine = false
    }
    return true
}

function getMines() {
    const mines = []
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine && !currCell.isShown) mines.push({ i, j })
        }
    }
    return mines
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-theme")
}
