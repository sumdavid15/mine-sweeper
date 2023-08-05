
function megaHint() {
    if (gGame.isMegaHint) return
    if (!gGame.isOn) return
    gGame.isMegaHint = true
    gGame.isOn = false
}

function revealArea(rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd) {

    const [rowStart, rowEnd] = [rowIdxStart, rowIdxEnd].sort((a, b) => a - b)
    const [colStart, colEnd] = [colIdxStart, colIdxEnd].sort((a, b) => a - b)

    for (let i = rowStart; i <= rowEnd; i++) {
        for (let j = colStart; j <= colEnd; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isShown) currCell.isShown = true
        }
    }
    renderBoard(gBoard)
    gPrevMove.push(gBoard)
}

const megaHintBtn = document.querySelector('.mega-btn');
megaHintBtn.setAttribute('title',
    'Mega-Hint works only once every game. It is used to reveal an area of the board for 2 seconds by clicking top left corner than bottom right corner')
